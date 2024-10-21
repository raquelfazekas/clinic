"use server"

import { db } from "@/drizzle";
import { patientFormSchema } from "@/schema/patient";
import { z } from "zod";
import { PatientTable } from "@/drizzle/schema";

export async function createPatient(unsafeData: z.infer<typeof patientFormSchema>) {
    const { success, data } = patientFormSchema.safeParse(unsafeData);

    if (!success) return { error: true };

    const result = await db.insert(PatientTable).values({
        ...data
    }).returning();


    const patientId = result[0].id

    return { patientId };
}
