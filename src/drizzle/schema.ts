import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const EventTable = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => ({
    clerkUserIdIndex: index("clerkUserIdIndex").on(table.clerkUserId),
  })
);

export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
});

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable),
}));

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilityTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
  },
  (table) => ({
    sheduleIdIndex: index("sheduleIdIndex").on(table.scheduleId),
  })
);

export const scheduleAvailabilityRelations = relations(
  ScheduleAvailabilityTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId],
      references: [ScheduleTable.id],
    }),
  })
);

// --- Pacientes ---
export const PatientTable = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  socialName: text("social_name"),
  cpf: text("cpf").notNull().unique(),
  dateOfBirth: timestamp("dateOfBirth").notNull(),
  gender: text("gender").notNull(),
  estado_civil: text('estado_civil').notNull(),
  children: integer("children").notNull(),
  work: text("work").notNull(),
  education: text("education").notNull(),
  origin: text("origin").notNull(),
  religion: text("religion").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  createdAt,
  updatedAt,
});

export type PatientSelect = InferSelectModel<typeof PatientTable>;
export type PatientInsert = InferInsertModel<typeof PatientTable>;


// --- Prontuário Eletrônico ---
export const HealthRecordTable = pgTable("health_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patientId")
    .notNull()
    .references(() => PatientTable.id, { onDelete: "cascade" }),
  visitDate: timestamp("visitDate").notNull(),
  notes: text("notes"),
  doctor: text("doctor").notNull(),
  attachments: text("attachments[]"),
  createdAt,
});

// --- Prescrição Eletrônica ---
export const PrescriptionTable = pgTable("prescriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patientId")
    .notNull()
    .references(() => PatientTable.id, { onDelete: "cascade" }),
  doctorId: text("doctorId").notNull(),
  medications: text("medications[]").notNull(),
  createdAt,
  updatedAt,
});

// --- Relations ---
export const patientRelations = relations(PatientTable, ({ many }) => ({
  healthRecords: many(HealthRecordTable),
  prescriptions: many(PrescriptionTable),
}));

export const healthRecordRelations = relations(HealthRecordTable, ({ one }) => ({
  patient: one(PatientTable, {
    fields: [HealthRecordTable.patientId],
    references: [PatientTable.id],
  }),
}));

export const prescriptionRelations = relations(PrescriptionTable, ({ one }) => ({
  patient: one(PatientTable, {
    fields: [PrescriptionTable.patientId],
    references: [PatientTable.id],
  }),
}));