import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1780597649505 implements MigrationInterface {
    name = 'InitialSchema1780597649505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."agencies_subscriptionplan_enum" AS ENUM('BASIC', 'PREMIUM')`);
        await queryRunner.query(`CREATE TABLE "agencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "logoUrl" character varying, "isActive" boolean NOT NULL DEFAULT true, "subscriptionPlan" "public"."agencies_subscriptionplan_enum" NOT NULL DEFAULT 'BASIC', "subscriptionExpiresAt" TIMESTAMP, CONSTRAINT "UQ_1ea16c73ecef4bab2f61c31c889" UNIQUE ("name"), CONSTRAINT "PK_8ab1f1f53f56c8255b0d7e68b28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "routes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "agencyId" uuid NOT NULL, "departureCity" character varying NOT NULL, "arrivalCity" character varying NOT NULL, "distanceKm" double precision NOT NULL, "estimatedDurationMinutes" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "agencyId" uuid NOT NULL, "plateNumber" character varying NOT NULL, "model" character varying NOT NULL, "totalSeats" integer NOT NULL, "seatLayout" jsonb NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_077c163f18b75a197b171f95457" UNIQUE ("plateNumber"), CONSTRAINT "PK_ddebc0eeba64a019ae072975947" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."trips_status_enum" AS ENUM('SCHEDULED', 'BOARDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "trips" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "agencyId" uuid NOT NULL, "routeId" uuid NOT NULL, "busId" uuid NOT NULL, "driverId" uuid, "departureDateTime" TIMESTAMP NOT NULL, "arrivalDateTime" TIMESTAMP NOT NULL, "basePrice" integer NOT NULL, "currencyCode" character varying NOT NULL DEFAULT 'XAF', "status" "public"."trips_status_enum" NOT NULL DEFAULT 'SCHEDULED', "pricingRules" jsonb, CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN_PLATFORM', 'AGENCY_MANAGER', 'CASHIER', 'CONTROLLER', 'DRIVER', 'CLIENT')`);
        await queryRunner.query(`CREATE TYPE "public"."users_preferredlanguage_enum" AS ENUM('fr', 'en')`);
        await queryRunner.query(`CREATE TYPE "public"."users_notificationchannel_enum" AS ENUM('WHATSAPP', 'SMS', 'EMAIL')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'CLIENT', "isActive" boolean NOT NULL DEFAULT true, "agencyId" uuid, "preferredLanguage" "public"."users_preferredlanguage_enum" NOT NULL DEFAULT 'fr', "notificationChannel" "public"."users_notificationchannel_enum" NOT NULL DEFAULT 'WHATSAPP', "notificationPhone" character varying, "privacyPolicyAcceptedAt" TIMESTAMP, "privacyPolicyVersion" character varying, "termsAcceptedAt" TIMESTAMP, "termsVersion" character varying, "privacyPolicyAcceptedLang" character varying, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_type_enum" AS ENUM('INDIVIDUAL', 'GROUP')`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_status_enum" AS ENUM('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'USED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "reservationCode" character varying NOT NULL, "tripId" uuid NOT NULL, "clientId" uuid NOT NULL, "agencyId" uuid NOT NULL, "type" "public"."reservations_type_enum" NOT NULL DEFAULT 'INDIVIDUAL', "totalAmount" integer NOT NULL, "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'PENDING_PAYMENT', "cancelledAt" TIMESTAMP, "cancelledBy" uuid, "cancelReason" character varying, "createdByRole" character varying NOT NULL, "refundEligibleAmount" integer, "refundPolicy" character varying, CONSTRAINT "UQ_d6ad9f86da529991b1ecaffc148" UNIQUE ("reservationCode"), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passengers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "reservationId" uuid NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "idCardNumber" character varying, "seatNumber" character varying NOT NULL, "ticketId" uuid, CONSTRAINT "PK_9863c72acd866e4529f65c6c98c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tickets_status_enum" AS ENUM('VALID', 'USED', 'CANCELLED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "passengerId" uuid NOT NULL, "reservationId" uuid NOT NULL, "qrPayload" text NOT NULL, "qrSignature" text NOT NULL, "issuedAt" TIMESTAMP NOT NULL, "validUntil" TIMESTAMP NOT NULL, "status" "public"."tickets_status_enum" NOT NULL DEFAULT 'VALID', "scannedAt" TIMESTAMP, "scannedBy" uuid, "scannedOffline" boolean NOT NULL DEFAULT false, "syncedAt" TIMESTAMP, CONSTRAINT "UQ_db8143d43a77a54bfcb0d4dcf3f" UNIQUE ("passengerId"), CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_provider_enum" AS ENUM('MTN_MOMO', 'ORANGE_MONEY', 'STRIPE', 'CASH')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "reservationId" uuid NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL DEFAULT 'XAF', "provider" "public"."payments_provider_enum" NOT NULL, "providerTransactionId" character varying, "providerReference" character varying, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'PENDING', "paymentMethod" character varying NOT NULL, "metadata" jsonb, "failureReason" character varying, "refundedAt" TIMESTAMP, "refundedBy" uuid, "refundAmount" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."legal_documents_type_enum" AS ENUM('PRIVACY_POLICY', 'TERMS_OF_SERVICE')`);
        await queryRunner.query(`CREATE TYPE "public"."legal_documents_lang_enum" AS ENUM('fr', 'en')`);
        await queryRunner.query(`CREATE TABLE "legal_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" "public"."legal_documents_type_enum" NOT NULL, "version" character varying NOT NULL, "lang" "public"."legal_documents_lang_enum" NOT NULL, "content" text NOT NULL, "publishedAt" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_846b11262368906ded5d26ac271" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, "action" character varying NOT NULL, "entityType" character varying NOT NULL, "entityId" uuid NOT NULL, "ipAddress" character varying, "userAgent" character varying, "metadata" jsonb NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_f556dbb98b6706303ae7fdc8310" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "buses" ADD CONSTRAINT "FK_b9628182bc9b50fe4ae7cdb2b49" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_61bdb9ccd0325b8b41ff8506e41" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_3fcad6442389eeb7aea5f1f25a8" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trips" ADD CONSTRAINT "FK_5cb200e0bc5828053dd3d60cfd8" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_ec264727095a4ff7c822c9dd97e" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_e31637a1b37f007468858cd3855" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_6307c2c86a0879bb7c2f6fc8e49" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passengers" ADD CONSTRAINT "FK_c48cd2c97351c1fb91b5b0189f5" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_db8143d43a77a54bfcb0d4dcf3f" FOREIGN KEY ("passengerId") REFERENCES "passengers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD CONSTRAINT "FK_f5f6f2e8bfda46f03c7aca6fbb1" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_1221b304716c539fde3fb3cb8db" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_1221b304716c539fde3fb3cb8db"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_f5f6f2e8bfda46f03c7aca6fbb1"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_db8143d43a77a54bfcb0d4dcf3f"`);
        await queryRunner.query(`ALTER TABLE "passengers" DROP CONSTRAINT "FK_c48cd2c97351c1fb91b5b0189f5"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_6307c2c86a0879bb7c2f6fc8e49"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_e31637a1b37f007468858cd3855"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_ec264727095a4ff7c822c9dd97e"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_5cb200e0bc5828053dd3d60cfd8"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_3fcad6442389eeb7aea5f1f25a8"`);
        await queryRunner.query(`ALTER TABLE "trips" DROP CONSTRAINT "FK_61bdb9ccd0325b8b41ff8506e41"`);
        await queryRunner.query(`ALTER TABLE "buses" DROP CONSTRAINT "FK_b9628182bc9b50fe4ae7cdb2b49"`);
        await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_f556dbb98b6706303ae7fdc8310"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "legal_documents"`);
        await queryRunner.query(`DROP TYPE "public"."legal_documents_lang_enum"`);
        await queryRunner.query(`DROP TYPE "public"."legal_documents_type_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TYPE "public"."tickets_status_enum"`);
        await queryRunner.query(`DROP TABLE "passengers"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_notificationchannel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_preferredlanguage_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "trips"`);
        await queryRunner.query(`DROP TYPE "public"."trips_status_enum"`);
        await queryRunner.query(`DROP TABLE "buses"`);
        await queryRunner.query(`DROP TABLE "routes"`);
        await queryRunner.query(`DROP TABLE "agencies"`);
        await queryRunner.query(`DROP TYPE "public"."agencies_subscriptionplan_enum"`);
    }

}
