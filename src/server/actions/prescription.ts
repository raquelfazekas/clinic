/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { db } from "@/drizzle";
import { PrescriptionTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function createPrescriptionRecord(
  type: string,
  data: Record<string, unknown>[],
  patientId: string,
  doctorName: string
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const result = await db
    .insert(PrescriptionTable)
    .values({
      patientId,
      doctorId: doctorName,
      medications: data,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result;
}


export async function deletePrescriptionRecords(id: string) {
  const { userId } = auth();

  if (!userId) {
    return { error: true, message: "Invalid data or missing user" };
  }

  try {
    const deletedRecord = await db
      .delete(PrescriptionTable)
      .where(eq(PrescriptionTable.id, id))
      .returning();

    if (deletedRecord.length === 0) {
      return { error: true, message: "No records were deleted" };
    }

    return { success: true, message: "Record deleted successfully" };
  } catch (error) {
    return { error: true, message: "An error occurred during deletion" };
  }
}
