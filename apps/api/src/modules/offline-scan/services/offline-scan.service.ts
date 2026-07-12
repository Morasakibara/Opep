import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OfflineScan, OfflineScanStatus } from '../entities/offline-scan.entity';
import { Ticket, TicketStatus } from '../../tickets/entities/ticket.entity';
import { CreateOfflineScanDto } from '../dto/create-offline-scan.dto';
import { SyncBatchDto } from '../dto/sync-batch.dto';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class OfflineScanService {
  constructor(
    @InjectRepository(OfflineScan)
    private readonly scanRepository: Repository<OfflineScan>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateOfflineScanDto, scannedBy?: string): Promise<OfflineScan> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: dto.ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket non trouvé');
    }

    // Verify the QR signature
    let status = OfflineScanStatus.PENDING_VERIFICATION;

    // For mock/dev: auto-verify if payload matches
    if (ticket.qrPayload === dto.qrPayload && ticket.qrSignature === dto.qrSignature) {
      status = OfflineScanStatus.VERIFIED;
    } else {
      status = OfflineScanStatus.INVALID;
    }

    const scan = this.scanRepository.create({
      ticketId: dto.ticketId,
      qrPayload: dto.qrPayload,
      qrSignature: dto.qrSignature,
      status,
      scannedAt: new Date(),
      scannedBy,
      latitude: dto.latitude,
      longitude: dto.longitude,
      deviceId: dto.deviceId,
      deviceName: dto.deviceName,
    });

    const saved = await this.scanRepository.save(scan);

    // Update ticket if verified
    if (status === OfflineScanStatus.VERIFIED) {
      ticket.scannedOffline = true;
      ticket.scannedAt = new Date();
      ticket.scannedBy = scannedBy || null;
      ticket.status = TicketStatus.USED;
      await this.ticketRepository.save(ticket);
    }

    this.auditService.log({
      userId: scannedBy,
      action: status === OfflineScanStatus.VERIFIED ? 'OFFLINE_SCAN_VERIFIED' : 'OFFLINE_SCAN_INVALID',
      entityType: 'offline_scan',
      entityId: saved.id,
      metadata: {
        ticketId: dto.ticketId,
        status,
        deviceId: dto.deviceId,
      },
    }).catch(() => {});

    return saved;
  }

  async syncBatch(dto: SyncBatchDto, scannedBy?: string): Promise<OfflineScan[]> {
    const results: OfflineScan[] = [];

    for (const scanDto of dto.scans) {
      try {
        const scan = await this.create(scanDto, scannedBy);
        results.push(scan);
      } catch (err) {
        // Continue with other scans even if one fails
        const failedScan = this.scanRepository.create({
          ticketId: scanDto.ticketId,
          qrPayload: scanDto.qrPayload,
          qrSignature: scanDto.qrSignature,
          status: OfflineScanStatus.PENDING_VERIFICATION,
          scannedAt: new Date(),
          scannedBy,
          deviceId: scanDto.deviceId,
          deviceName: scanDto.deviceName,
          failureReason: err.message,
        });
        results.push(await this.scanRepository.save(failedScan));
      }
    }

    return results;
  }

  async findAll(skip = 0, take = 50): Promise<{ items: OfflineScan[]; total: number }> {
    const [items, total] = await this.scanRepository.findAndCount({
      skip,
      take,
      order: { scannedAt: 'DESC' },
      relations: ['ticket'],
    });
    return { items, total };
  }

  async findOne(id: string): Promise<OfflineScan> {
    const scan = await this.scanRepository.findOne({
      where: { id },
      relations: ['ticket'],
    });
    if (!scan) throw new NotFoundException('Scan non trouvé');
    return scan;
  }

  async findByDevice(deviceId: string, skip = 0, take = 50): Promise<{ items: OfflineScan[]; total: number }> {
    const [items, total] = await this.scanRepository.findAndCount({
      where: { deviceId },
      skip,
      take,
      order: { scannedAt: 'DESC' },
    });
    return { items, total };
  }

  async verifyScan(id: string, verifiedBy: string): Promise<OfflineScan> {
    const scan = await this.findOne(id);

    if (scan.status !== OfflineScanStatus.PENDING_VERIFICATION) {
      throw new BadRequestException(
        `Scan déjà ${scan.status === OfflineScanStatus.VERIFIED ? 'vérifié' : 'traité'}`,
      );
    }

    scan.status = OfflineScanStatus.VERIFIED;
    scan.verifiedAt = new Date();
    scan.verifiedBy = verifiedBy;
    scan.syncedAt = new Date();

    return this.scanRepository.save(scan);
  }

  async markAsSynced(id: string): Promise<void> {
    await this.scanRepository.update(id, { syncedAt: new Date() });
  }

  async getUnsynced(deviceId?: string): Promise<OfflineScan[]> {
    const where: any = { syncedAt: null };
    if (deviceId) where.deviceId = deviceId;

    return this.scanRepository.find({
      where,
      order: { scannedAt: 'ASC' },
    });
  }
}
