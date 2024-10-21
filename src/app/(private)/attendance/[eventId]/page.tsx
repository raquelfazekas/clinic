import { GoogleCalendarEvent } from "@/data/types";
import { db } from "@/drizzle";
import { getscheduleById } from "@/server/googleCalendar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AttendancePage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;
  const { userId, redirectToSignIn } = auth();

  if (userId == null) return redirectToSignIn();

  const event: GoogleCalendarEvent = await getscheduleById(userId, eventId);

  const patientEmail = event.attendees.find(
    (attendee) => !attendee.organizer
  )?.email;

  if (!patientEmail) {
    return <div>Erro: O evento não contém informações do paciente.</div>;
  }

  const patient = await db.query.PatientTable.findFirst({
    where: (patients, { eq }) => eq(patients.email, patientEmail),
  });

  if (patient) {
    return redirect(`/patient/${patient.id}`);
  }

  return redirect(`/patient/registration/${eventId}`);
}
