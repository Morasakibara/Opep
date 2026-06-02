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

// ... other types will be added as needed
