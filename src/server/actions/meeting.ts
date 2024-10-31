"use server"
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { meetingActionSchema } from "@/schema/meetings"
import "use-server"
import { z } from "zod"
import { createCalendarEvent } from "../googleCalendar"
import { redirect } from "next/navigation"
import {  toZonedTime } from "date-fns-tz"
import { db } from "@/drizzle"

export async function createMeeting(
    unsafeData: z.infer<typeof meetingActionSchema>
) {
    const { success, data } = meetingActionSchema.safeParse(unsafeData)

    console.log("data:", data)

    if (!success) return { error: true }

    const event = await db.query.EventTable.findFirst({
        where: ({ clerkUserId, isActive, id }, { eq, and }) =>
            and(
                eq(isActive, true),
                eq(clerkUserId, data.clerkUserId),
                eq(id, data.eventId)
            ),
    })

    if (event == null) return { error: true }

    const startInTimezone = toZonedTime(data.startTime, data.timezone)

    console.log("startInTimezone", startInTimezone)

    const validTimes = await getValidTimesFromSchedule([startInTimezone], event)

    console.log("validTimes:", validTimes)

    if (validTimes.length === 0) return { error: true }

    await createCalendarEvent({
        ...data,
        startTime: startInTimezone,
        durationInMinutes: event.durationInMinutes,
        eventName: event.name,
    })

    redirect(
        `/book/${data.clerkUserId}/${data.eventId
        }/success?startTime=${data.startTime.toISOString()}`
    )
}