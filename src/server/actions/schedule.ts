"use server";

import { db } from "@/drizzle";
import { ScheduleAvailabilityTable, ScheduleTable } from "@/drizzle/schema";
import { scheduleFormSchema } from "@/schema/schedule";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function saveSchedule(
  unsafeData: z.infer<typeof scheduleFormSchema>
) {
  const { userId } = auth();
  const { success, data } = scheduleFormSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  const { availabilities, ...scheduleData } = data;

  const [{ id: scheduleId }] = await db
    .insert(ScheduleTable)
    .values({ ...scheduleData, clerkUserId: userId })
    .onConflictDoUpdate({
      target: ScheduleTable.clerkUserId,
      set: scheduleData,
    })
    .returning({ id: ScheduleTable.id });

  await db
    .delete(ScheduleAvailabilityTable)
    .where(eq(ScheduleAvailabilityTable.scheduleId, scheduleId));

  if (availabilities.length > 0) {
    await db.insert(ScheduleAvailabilityTable).values(
      availabilities.map((availability) => ({
        ...availability,
        scheduleId,
      }))
    );
  }

  return { success: true };
}
