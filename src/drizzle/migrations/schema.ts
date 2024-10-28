import { pgTable, index, uuid, text, integer, boolean, timestamp, foreignKey, unique, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const day = pgEnum("day", ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabádo', 'domingo'])



export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	durationInMinutes: integer().notNull(),
	clerkUserId: text().notNull(),
	isActive: boolean().default(true).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		clerkUserIdIndex: index("clerkUserIdIndex").using("btree", table.clerkUserId.asc().nullsLast()),
	}
});

export const healthRecords = pgTable("health_records", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	patientId: uuid().notNull(),
	visitDate: timestamp({ mode: 'string' }).notNull(),
	notes: text(),
	doctor: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		healthRecordsPatientIdPatientsIdFk: foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "health_records_patientId_patients_id_fk"
		}).onDelete("cascade"),
	}
});

export const patients = pgTable("patients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	dateOfBirth: timestamp({ mode: 'string' }).notNull(),
	gender: text().notNull(),
	estadoCivil: text("estado_civil").notNull(),
	children: integer().notNull(),
	work: text().notNull(),
	education: text().notNull(),
	origin: text().notNull(),
	religion: text().notNull(),
	email: text().notNull(),
	phone: text(),
	address: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	socialName: text("social_name"),
	cpf: text().notNull(),
},
(table) => {
	return {
		patientsCpfUnique: unique("patients_cpf_unique").on(table.cpf),
		patientsEmailUnique: unique("patients_email_unique").on(table.email),
	}
});

export const prescriptions = pgTable("prescriptions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	patientId: uuid().notNull(),
	doctorId: text().notNull(),
	"medications[]": text("medications[]").notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		prescriptionsPatientIdPatientsIdFk: foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "prescriptions_patientId_patients_id_fk"
		}).onDelete("cascade"),
	}
});

export const scheduleAvailabilities = pgTable("scheduleAvailabilities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	scheduleId: uuid().notNull(),
	startTime: text().notNull(),
	endTime: text().notNull(),
	dayOfWeek: day().notNull(),
},
(table) => {
	return {
		sheduleIdIndex: index("sheduleIdIndex").using("btree", table.scheduleId.asc().nullsLast()),
		scheduleAvailabilitiesScheduleIdSchedulesIdFk: foreignKey({
			columns: [table.scheduleId],
			foreignColumns: [schedules.id],
			name: "scheduleAvailabilities_scheduleId_schedules_id_fk"
		}).onDelete("cascade"),
	}
});

export const schedules = pgTable("schedules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timezone: text().notNull(),
	clerkUserId: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		schedulesClerkUserIdUnique: unique("schedules_clerkUserId_unique").on(table.clerkUserId),
	}
});
