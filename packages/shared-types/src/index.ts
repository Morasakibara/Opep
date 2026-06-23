import { z } from 'zod';

// Enums (déjà existants)
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

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum TripStatus {
  SCHEDULED = 'SCHEDULED',
  BOARDING = 'BOARDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionPlan {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

// UUID helpers
const uuid = z.string().uuid();
const optionalUuid = z.string().uuid().optional();

// Schémas partagés

export const AgencySchema = z.object({
  id: uuid,
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  logoUrl: z.string().url().optional(),
  isActive: z.boolean(),
  subscriptionPlan: z.nativeEnum(SubscriptionPlan),
  subscriptionExpiresAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Agency = z.infer<typeof AgencySchema>;

export const RouteSchema = z.object({
  id: uuid,
  agencyId: uuid,
  departureCity: z.string().min(1),
  arrivalCity: z.string().min(1),
  distanceKm: z.number().positive(),
  estimatedDurationMinutes: z.number().int().positive(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Route = z.infer<typeof RouteSchema>;

export const BusSchema = z.object({
  id: uuid,
  agencyId: uuid,
  plateNumber: z.string().min(1),
  model: z.string().min(1),
  totalSeats: z.number().int().positive(),
  seatLayout: z.record(z.any()), // JSON layout
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Bus = z.infer<typeof BusSchema>;

export const TripSchema = z.object({
  id: uuid,
  agencyId: uuid,
  routeId: uuid,
  busId: uuid,
  driverId: optionalUuid,
  departureDateTime: z.date(),
  arrivalDateTime: z.date(),
  basePrice: z.number().int().positive(),
  currencyCode: z.string().default('XAF'),
  status: z.nativeEnum(TripStatus),
  pricingRules: z.record(z.any()).optional(),
  route: RouteSchema.optional(),
  bus: BusSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Trip = z.infer<typeof TripSchema>;

export const UserSchema = z.object({
  id: uuid,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean(),
  agencyId: optionalUuid,
  preferredLanguage: z.nativeEnum(Language),
  notificationChannel: z.nativeEnum(NotificationChannel),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const PassengerSchema = z.object({
  id: uuid,
  reservationId: uuid,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idCardNumber: z.string().optional(),
  seatNumber: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Passenger = z.infer<typeof PassengerSchema>;

export const ReservationSchema = z.object({
  id: uuid,
  reservationCode: z.string().min(1),
  tripId: uuid,
  clientId: uuid,
  agencyId: uuid,
  type: z.enum(['INDIVIDUAL', 'GROUP']),
  totalAmount: z.number().int().positive(),
  status: z.nativeEnum(ReservationStatus),
  cancelledAt: z.date().nullable().optional(),
  cancelReason: z.string().optional(),
  passengers: z.array(PassengerSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Reservation = z.infer<typeof ReservationSchema>;

export const TicketSchema = z.object({
  id: uuid,
  passengerId: uuid,
  reservationId: uuid,
  qrPayload: z.string(),
  qrSignature: z.string(),
  issuedAt: z.date(),
  validUntil: z.date(),
  status: z.nativeEnum(TicketStatus),
  scannedAt: z.date().nullable().optional(),
  scannedOffline: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  passenger: PassengerSchema.optional(),
});

export type Ticket = z.infer<typeof TicketSchema>;

export const PaymentSchema = z.object({
  id: uuid,
  reservationId: uuid,
  amount: z.number().int().positive(),
  currency: z.string().default('XAF'),
  provider: z.nativeEnum(PaymentProvider),
  providerTransactionId: z.string().optional(),
  status: z.nativeEnum(PaymentStatus),
  paymentMethod: z.string(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// DTOs pour les requêtes

export const TripSearchCriteriaSchema = z.object({
  departureCity: z.string().min(1),
  arrivalCity: z.string().min(1),
  date: z.string().datetime(),
  passengers: z.number().int().min(1).max(10),
});

export type TripSearchCriteria = z.infer<typeof TripSearchCriteriaSchema>;

export const CreateReservationDtoSchema = z.object({
  tripId: uuid,
  passengers: z.array(z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    idCardNumber: z.string().optional(),
    seatNumber: z.string().min(1),
  })).min(1),
  paymentProvider: z.nativeEnum(PaymentProvider),
});

export type CreateReservationDto = z.infer<typeof CreateReservationDtoSchema>;

// QR Ticket validation
export const QrTicketPayloadSchema = z.object({
  passengerId: uuid,
  tripId: uuid,
  seatNumber: z.string(),
  reservationCode: z.string(),
});

export type QrTicketPayload = z.infer<typeof QrTicketPayloadSchema>;

// Export des schémas pour validation
export const Schemas = {
  Agency: AgencySchema,
  Route: RouteSchema,
  Bus: BusSchema,
  Trip: TripSchema,
  User: UserSchema,
  Passenger: PassengerSchema,
  Reservation: ReservationSchema,
  Ticket: TicketSchema,
  Payment: PaymentSchema,
  TripSearchCriteria: TripSearchCriteriaSchema,
  CreateReservationDto: CreateReservationDtoSchema,
  QrTicketPayload: QrTicketPayloadSchema,
};
