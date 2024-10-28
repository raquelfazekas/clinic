import { relations } from "drizzle-orm/relations";
import { patients, healthRecords, prescriptions, schedules, scheduleAvailabilities } from "./schema";

export const healthRecordsRelations = relations(healthRecords, ({one}) => ({
	patient: one(patients, {
		fields: [healthRecords.patientId],
		references: [patients.id]
	}),
}));

export const patientsRelations = relations(patients, ({many}) => ({
	healthRecords: many(healthRecords),
	prescriptions: many(prescriptions),
}));

export const prescriptionsRelations = relations(prescriptions, ({one}) => ({
	patient: one(patients, {
		fields: [prescriptions.patientId],
		references: [patients.id]
	}),
}));

export const scheduleAvailabilitiesRelations = relations(scheduleAvailabilities, ({one}) => ({
	schedule: one(schedules, {
		fields: [scheduleAvailabilities.scheduleId],
		references: [schedules.id]
	}),
}));

export const schedulesRelations = relations(schedules, ({many}) => ({
	scheduleAvailabilities: many(scheduleAvailabilities),
}));