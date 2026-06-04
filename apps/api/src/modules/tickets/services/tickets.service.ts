import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Passenger } from '../../reservations/entities/passenger.entity';
import { generateTicketQR, TicketPayload } from '@opep/qr-utils';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class TicketsService {
  private privateKey: string;

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    private readonly configService: ConfigService,
  ) {
    // Load RSA Private Key for signing
    // For demo purposes, we might use a dummy key or load from env/file
    const keyPath = this.configService.get('RSA_PRIVATE_KEY_PATH');
    if (keyPath && fs.existsSync(keyPath)) {
      this.privateKey = fs.readFileSync(keyPath, 'utf8');
    } else {
      // Fallback or development dummy key (SHOULD NEVER BE USED IN PROD)
      this.privateKey = this.configService.get('RSA_PRIVATE_KEY');
    }
  }

  async generateTicketsForReservation(reservationId: string): Promise<Ticket[]> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['trip', 'trip.route', 'agency'],
    });

    if (!reservation) throw new NotFoundException('Réservation non trouvée');
    if (reservation.status !== ReservationStatus.CONFIRMED) {
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
        validUntil: new Date(reservation.trip.departureDateTime.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Valid for 24h after departure
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

    return tickets;
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
    if (!ticket) throw new NotFoundException('Ticket non trouvé');
    return ticket;
  }
}
