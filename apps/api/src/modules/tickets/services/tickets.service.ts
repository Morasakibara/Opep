import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { Passenger } from '../../reservations/entities/passenger.entity';
import { generateTicketQR, TicketPayload } from '@opep/qr-utils';

@Injectable()
export class TicketsService {
  private privateKey: string;
  private publicKey: string;

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>,
    private readonly configService: ConfigService,
  ) {
    this.loadKeys();
  }

  private loadKeys() {
    const privPath = this.configService.get('RSA_PRIVATE_KEY_PATH', './keys/private.pem');
    const pubPath = this.configService.get('RSA_PUBLIC_KEY_PATH', './keys/public.pem');

    try {
      if (fs.existsSync(privPath)) {
        this.privateKey = fs.readFileSync(privPath, 'utf8');
      }
      if (fs.existsSync(pubPath)) {
        this.publicKey = fs.readFileSync(pubPath, 'utf8');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clés RSA:', error);
    }
  }

  async generateForPassenger(passengerId: string): Promise<Ticket> {
    const passenger = await this.passengerRepo.findOne({
      where: { id: passengerId },
      relations: ['reservation', 'reservation.trip', 'reservation.trip.route', 'reservation.trip.agency'],
    });

    if (!passenger) throw new NotFoundException('Passager introuvable');

    // Vérifier si un ticket existe déjà
    let ticket = await this.ticketRepo.findOne({ where: { passengerId } });
    if (ticket) return ticket;

    const trip = passenger.reservation.trip;
    const route = trip.route;
    const issuedAt = new Date();
    const validUntil = new Date(trip.departureDateTime);
    validUntil.setHours(validUntil.getHours() + 24); // Valide 24h après le départ

    const payload: TicketPayload = {
      ticketId: '', // Sera mis à jour après création
      reservationCode: passenger.reservation.reservationCode,
      passengerName: `${passenger.firstName} ${passenger.lastName}`,
      seatNumber: passenger.seatNumber,
      tripId: trip.id,
      departureCity: route.departureCity,
      arrivalCity: route.arrivalCity,
      departureDateTime: trip.departureDateTime.toISOString(),
      validUntil: validUntil.toISOString(),
      agencyId: trip.agencyId,
      issuedAt: issuedAt.toISOString(),
    };

    // Création initiale pour avoir l'ID
    ticket = this.ticketRepo.create({
      passengerId,
      reservationId: passenger.reservationId,
      issuedAt,
      validUntil,
      qrPayload: '',
      qrSignature: '',
      status: TicketStatus.VALID,
    });

    ticket = await this.ticketRepo.save(ticket);
    payload.ticketId = ticket.id;

    if (!this.privateKey) {
      throw new InternalServerErrorException('Clé privée RSA manquante pour la signature');
    }

    const qrString = await generateTicketQR(payload, this.privateKey);
    const [qrPayload, qrSignature] = qrString.split('.');

    ticket.qrPayload = qrPayload;
    ticket.qrSignature = qrSignature;

    return this.ticketRepo.save(ticket);
  }

  async generatePdf(ticketId: string): Promise<Buffer> {
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['passenger', 'reservation', 'reservation.trip', 'reservation.trip.route', 'reservation.trip.agency', 'reservation.trip.bus'],
    });

    if (!ticket) throw new NotFoundException('Ticket introuvable');

    const qrData = `${ticket.qrPayload}.${ticket.qrSignature}`;
    const qrBuffer = await QRCode.toBuffer(qrData, { margin: 1, width: 200 });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Design du Ticket
      doc.rect(20, 20, 550, 250).stroke();
      
      doc.fontSize(20).text(ticket.reservation.trip.agency.name, { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`TICKET DE TRANSPORT - ${ticket.reservation.reservationCode}`, { align: 'center', underline: true });
      doc.moveDown();

      const startY = doc.y;
      
      // Colonne gauche (Infos)
      doc.fontSize(10);
      doc.text(`PASSAGER: ${ticket.passenger.firstName} ${ticket.passenger.lastName}`, 50, startY);
      doc.text(`DEPART: ${ticket.reservation.trip.route.departureCity}`, 50, startY + 20);
      doc.text(`ARRIVEE: ${ticket.reservation.trip.route.arrivalCity}`, 50, startY + 40);
      doc.text(`DATE/HEURE: ${ticket.reservation.trip.departureDateTime.toLocaleString('fr-FR')}`, 50, startY + 60);
      doc.text(`SIEGE: ${ticket.passenger.seatNumber}`, 50, startY + 80);
      doc.text(`BUS: ${ticket.reservation.trip.bus.plateNumber} (${ticket.reservation.trip.bus.model})`, 50, startY + 100);

      // Colonne droite (QR Code)
      doc.image(qrBuffer, 380, startY - 10, { width: 150 });
      
      doc.fontSize(8).text('Présentez ce QR Code à l\'embarquement', 380, startY + 145, { width: 150, align: 'center' });

      doc.end();
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['passenger', 'reservation', 'reservation.trip', 'reservation.trip.route'],
    });
    if (!ticket) throw new NotFoundException('Ticket introuvable');
    return ticket;
  }
}
