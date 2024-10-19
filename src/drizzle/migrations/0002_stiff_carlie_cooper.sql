CREATE TABLE IF NOT EXISTS "health_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patientId" uuid NOT NULL,
	"visitDate" timestamp NOT NULL,
	"notes" text,
	"doctor" text NOT NULL,
	"attachments[]" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"dateOfBirth" timestamp NOT NULL,
	"gender" text NOT NULL,
	"estado_civil" text NOT NULL,
	"children" integer NOT NULL,
	"work" text NOT NULL,
	"education" text NOT NULL,
	"origin" text NOT NULL,
	"religion" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prescriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patientId" uuid NOT NULL,
	"doctorId" text NOT NULL,
	"medications[]" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "health_records" ADD CONSTRAINT "health_records_patientId_patients_id_fk" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_patients_id_fk" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
