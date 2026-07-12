import {
  Trip, Ticket, User, Reservation, Payment,
  Route, Bus, Agency, Company, Centre
} from '@opep/shared-types';

// API response types include joined/nested data beyond the base entities.
// These enriched types eliminate the need for `as any` casts in consumer code.

export interface ApiTrip extends Trip {
  agency?: { name: string; logoUrl?: string };
}

export interface ApiTicket extends Ticket {
  trip?: { route?: { departureCity?: string; arrivalCity?: string } };
  totalAmount?: number;
  reservationCode?: string;
}

export interface ApiUser extends User {
  loyaltyPoints?: number;
  loyaltyTier?: string;
}

// Re-export shared types that don't need enrichment
export type { Reservation, Payment, Route, Bus, Agency, Company, Centre };
