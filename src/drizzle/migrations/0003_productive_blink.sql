ALTER TABLE "patients" ADD COLUMN "social_name" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "cpf" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_cpf_unique" UNIQUE("cpf");