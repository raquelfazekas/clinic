"use server"

import { db } from "@/drizzle";
import { patientFormSchema } from "@/schema/patient";
import { z } from "zod";
import { PatientTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createPatient(unsafeData: z.infer<typeof patientFormSchema>) {
    const { userId } = auth();
    const { success, data } = patientFormSchema.safeParse(unsafeData);

    if (!success || userId == null) {
        return { error: true };
    }

    const result = await db.insert(PatientTable).values({
        ...data
    }).returning();


    const patientId = result[0].id

    return { patientId };
}


export async function deletePatientById(patietId: string) {
    const { userId } = auth();
    if (userId == null) {
        return { error: true };
    }
    const result = await db.delete(PatientTable).where(eq(PatientTable.id, patietId))

    return JSON.parse(JSON.stringify(result))
}


export async function updatePatient(id: string, unsafeData: z.infer<typeof patientFormSchema>) {
    const { userId } = auth();
    const { success, data } = patientFormSchema.safeParse(unsafeData);

    if (!success || userId == null) {
        return { error: true };
    }

    const records = await db
        .update(PatientTable)
        .set({ ...data })
        .where(and(eq(PatientTable.id, id), eq(PatientTable.id, id)))
        .returning();

    if (!records) {
        return { error: true };
    }

    const patientId = records[0].id

    return { patientId };

}