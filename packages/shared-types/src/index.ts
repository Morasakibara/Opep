import { z } from 'zod';

export enum UserRole {
  ADMIN_PLATFORM = 'ADMIN_PLATFORM',
  AGENCY_MANAGER = 'AGENCY_MANAGER',
  CASHIER = 'CASHIER',
  CONTROLLER = 'CONTROLLER',
  DRIVER = 'DRIVER',
  CLIENT = 'CLIENT',
}

export enum Language {
  FR = 'fr',
  EN = 'en',
}

export enum NotificationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum ReservationStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentProvider {
  MTN_MOMO = 'MTN_MOMO',
  ORANGE_MONEY = 'ORANGE_MONEY',
  STRIPE = 'STRIPE',
  CASH = 'CASH',
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole),
  agencyId: z.string().uuid().optional(),
  preferredLanguage: z.nativeEnum(Language),
  notificationChannel: z.nativeEnum(NotificationChannel),
});

export type User = z.infer<typeof UserSchema>;

export interface TripSearchCriteria {
  departureCity: string;
  arrivalCity: string;
  date: string;
  passengers: number;
}
