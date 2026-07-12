import { OfflineScan, OfflineScanStatus } from '../entities/offline-scan.entity';

export class OfflineScanResponseDto {
  id: string;
  ticketId: string;
  qrPayload: string;
  status: OfflineScanStatus;
  scannedAt: Date;
  scannedBy?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  latitude?: number;
  longitude?: number;
  deviceId?: string;
  deviceName?: string;
  syncedAt?: Date;
  failureReason?: string;

  static fromEntity(scan: OfflineScan): OfflineScanResponseDto {
    return {
      id: scan.id,
      ticketId: scan.ticketId,
      qrPayload: scan.qrPayload,
      status: scan.status,
      scannedAt: scan.scannedAt,
      scannedBy: scan.scannedBy,
      verifiedAt: scan.verifiedAt,
      verifiedBy: scan.verifiedBy,
      latitude: scan.latitude,
      longitude: scan.longitude,
      deviceId: scan.deviceId,
      deviceName: scan.deviceName,
      syncedAt: scan.syncedAt,
      failureReason: scan.failureReason,
    };
  }
}
