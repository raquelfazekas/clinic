"use server"

import { db } from "@/drizzle";
import { patientFormSchema } from "@/schema/patient";
import { z } from "zod";
import { PatientTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function createPatient(unsafeData: z.infer<typeof patientFormSchema>) {
    const { success, data } = patientFormSchema.safeParse(unsafeData);

    if (!success) return { error: true };

    const result = await db.insert(PatientTable).values({
        ...data
    }).returning();


    const patientId = result[0].id

    return { patientId };
}


export async function deletePatientById(patietId: string) {
    const result = await db.delete(PatientTable).where(eq(PatientTable.id, patietId))

    return JSON.parse(JSON.stringify(result))
}