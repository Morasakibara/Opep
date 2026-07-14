import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Passenger } from '../../reservations/entities/passenger.entity';
import { generateTicketQR, validateTicketQR, TicketPayload } from '@opep/qr-utils';
import { ConfigService } from '@nestjs/config';
import { AuditService } from '../../audit/services/audit.service';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);
  private privateKey: string;
  private publicKey: string;

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {
    // Load RSA keys
    const privKeyPath = this.configService.get('RSA_PRIVATE_KEY_PATH');
    if (privKeyPath && fs.existsSync(privKeyPath)) {
      this.privateKey = fs.readFileSync(privKeyPath, 'utf8');
    } else {
      this.privateKey = this.configService.get('RSA_PRIVATE_KEY');
    }

    const pubKeyPath = this.configService.get('RSA_PUBLIC_KEY_PATH');
    if (pubKeyPath && fs.existsSync(pubKeyPath)) {
      this.publicKey = fs.readFileSync(pubKeyPath, 'utf8');
    } else {
      this.publicKey = this.configService.get('RSA_PUBLIC_KEY');
    }
  }

  async generateTicketsForReservation(reservationId: string): Promise<Ticket[]> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['trip', 'trip.route', 'agency'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');
    if (reservation.status !== ReservationStatus.CONFIRMED &&
        reservation.status !== ReservationStatus.PENDING_BALANCE) {
      throw new BadRequestException('La réservation doit être confirmée pour générer des tickets');
    }

    const passengers = await this.passengerRepository.find({
      where: { reservationId },
    });

    const tickets: Ticket[] = [];

    for (const passenger of passengers) {
      // Check if ticket already exists
      let ticket = await this.ticketRepository.findOne({
        where: { passengerId: passenger.id },
      });

      if (ticket) {
        tickets.push(ticket);
        continue;
      }

      const payload: TicketPayload = {
        ticketId: '', // Will be updated if needed, but often we use the entity ID
        reservationCode: reservation.reservationCode,
        passengerName: `${passenger.firstName} ${passenger.lastName}`,
        seatNumber: passenger.seatNumber,
        tripId: reservation.tripId,
        departureCity: reservation.trip.route.departureCity,
        arrivalCity: reservation.trip.route.arrivalCity,
        departureDateTime: reservation.trip.departureDateTime.toISOString(),
        validUntil: new Date(reservation.trip.departureDateTime.getTime() + 2 * 60 * 60 * 1000).toISOString(), // Valid for 2h after departure
        agencyId: reservation.agencyId,
        issuedAt: new Date().toISOString(),
      };

      // Generate a temporary ID to include in payload if required by logic
      const tempId = crypto.randomUUID();
      payload.ticketId = tempId;

      const qrString = await generateTicketQR(payload, this.privateKey);
      const [qrPayload, qrSignature] = qrString.split('.');

      ticket = this.ticketRepository.create({
        id: tempId,
        passengerId: passenger.id,
        reservationId,
        qrPayload,
        qrSignature,
        issuedAt: new Date(),
        validUntil: new Date(payload.validUntil),
        status: TicketStatus.VALID,
      });

      const savedTicket = await this.ticketRepository.save(ticket);
      tickets.push(savedTicket);
    }

    // Audit après génération
    this.auditService.log({
      action: 'TICKETS_GENERATED',
      entityType: 'ticket',
      entityId: reservationId,
      metadata: {
        reservationCode: reservation.reservationCode,
        ticketCount: tickets.length,
        passengerNames: passengers.map(p => `${p.firstName} ${p.lastName}`),
      },
    }).catch(() => {});

    return tickets;
  }

  async getMyTickets(userId: string): Promise<Ticket[]> {
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.passenger', 'passenger')
      .leftJoinAndSelect('ticket.reservation', 'reservation')
      .leftJoinAndSelect('reservation.trip', 'trip')
      .leftJoinAndSelect('trip.route', 'route')
      .where('reservation.clientId = :userId', { userId })
      .orderBy('ticket.issuedAt', 'DESC')
      .getMany();
  }

  async getTicketsByReservation(reservationId: string): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { reservationId },
      relations: ['passenger'],
    });
  }

  async getTicket(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['passenger', 'reservation', 'reservation.trip', 'reservation.trip.route'],
    });
    if (!ticket) throw new NotFoundException('Ticket non trouve');
    return ticket;
  }

  async validateAndScan(qrString: string, scannerUserId?: string): Promise<{
    valid: boolean;
    ticketId?: string;
    passengerName?: string;
    seatNumber?: string;
    tripRoute?: string;
    departureTime?: string;
    reason?: string;
  }> {
    // 1. Cryptographic validation
    if (!this.publicKey) {
      this.logger.error('Public key missing — validation not available');
      return { valid: false, reason: 'Validation non disponible (cle publique manquante)' };
    }

    const validation = validateTicketQR(qrString, this.publicKey);
    if (!validation.valid || !validation.payload) {
      this.auditService.log({
        action: 'TICKET_VALIDATION_FAILED',
        entityType: 'ticket',
        entityId: 'unknown',
        metadata: { reason: validation.reason },
      }).catch(() => {});
      return { valid: false, reason: validation.reason || 'Signature invalide' };
    }

    const payload = validation.payload;

    // 2. Check if ticket exists in DB and its status
    const ticket = await this.ticketRepository.findOne({
      where: { id: payload.ticketId },
      relations: ['passenger', 'reservation', 'reservation.trip', 'reservation.trip.route'],
    });

    if (!ticket) {
      return { valid: false, reason: 'Ticket introuvable en base' };
    }

    if (ticket.status === TicketStatus.USED) {
      return { valid: false, reason: 'Ticket deja utilise', ticketId: ticket.id };
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      return { valid: false, reason: 'Ticket annule', ticketId: ticket.id };
    }

    if (ticket.status === TicketStatus.EXPIRED || new Date(ticket.validUntil) < new Date()) {
      if (ticket.status !== TicketStatus.EXPIRED) {
        ticket.status = TicketStatus.EXPIRED;
        await this.ticketRepository.save(ticket);
      }
      return { valid: false, reason: 'Ticket expire', ticketId: ticket.id };
    }

    // 3. Mark ticket as scanned
    ticket.status = TicketStatus.USED;
    ticket.scannedAt = new Date();
    ticket.scannedBy = scannerUserId || null;
    ticket.scannedOffline = false;
    await this.ticketRepository.save(ticket);

    // 4. Audit
    this.auditService.log({
      action: 'TICKET_SCANNED',
      entityType: 'ticket',
      entityId: ticket.id,
      userId: scannerUserId,
      metadata: {
        passengerName: payload.passengerName,
        seatNumber: payload.seatNumber,
        tripRoute: `${payload.departureCity} -> ${payload.arrivalCity}`,
      },
    }).catch(() => {});

    // 5. Return success with ticket details
    return {
      valid: true,
      ticketId: ticket.id,
      passengerName: payload.passengerName,
      seatNumber: payload.seatNumber,
      tripRoute: `${payload.departureCity} -> ${payload.arrivalCity}`,
      departureTime: payload.departureDateTime,
    };
  }
}
