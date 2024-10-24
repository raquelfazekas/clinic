"use server";

import { db } from "@/drizzle";
import { z } from "zod";
import { HealthRecordTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { healthRecordTableSchema } from "@/schema/medicalrecord";
import { eq } from "drizzle-orm";

export async function createMedicalRecords(
  unsafeData: z.infer<typeof healthRecordTableSchema>
) {
  const { userId } = auth();
  const { success, data } = healthRecordTableSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  const result = await db
    .insert(HealthRecordTable)
    .values({
      visitDate: data.visitDate,
      doctor: data.doctor,
      notes: data.notes,
      createdAt: data.createdAt,
      patientId: data.patientId,
    })
    .returning();

  return { error: false, result };
}

export async function updateMedicalRecords(
  unsafeData: z.infer<typeof healthRecordTableSchema>,
  id: string
) {
  const { userId } = auth();
  const { success, data } = healthRecordTableSchema.safeParse(unsafeData);

  if (!success || !userId) {
    return { error: true, message: "Invalid data or missing user" };
  }

  try {
    const records = await db
      .update(HealthRecordTable)
      .set({ ...data })
      .where(eq(HealthRecordTable.id, id))
      .returning();

    if (records.length === 0) {
      return { error: true, message: "No records were updated" };
    }

    const patientId = records[0].id;

    return { success: true, patientId };
  } catch (error) {
    return { error: true, message: error };
  }
}
