"use server"
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { meetingActionSchema } from "@/schema/meetings"
import "use-server"
import { z } from "zod"
import { createCalendarEvent } from "../googleCalendar"
import { redirect } from "next/navigation"
import { fromZonedTime } from "date-fns-tz"
import { db } from "@/drizzle"
import { subHours } from "date-fns"

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

    const startInTimezone = fromZonedTime(data.startTime, data.timezone)

    const startInTimezone2 = subHours(startInTimezone, 3)

    console.log("startInTimezone",startInTimezone2)

    const validTimes = await getValidTimesFromSchedule([startInTimezone2], event)

    console.log("validTimes:", validTimes)

    if (validTimes.length === 0) return { error: true }

    await createCalendarEvent({
        ...data,
        startTime: startInTimezone2,
        durationInMinutes: event.durationInMinutes,
        eventName: event.name,
    })

    redirect(
        `/book/${data.clerkUserId}/${data.eventId
        }/success?startTime=${data.startTime.toISOString()}`
    )
}