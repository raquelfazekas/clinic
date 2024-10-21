import { PatientForm } from "@/components/form/PatientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleCalendarEvent } from "@/data/types";
import { getscheduleById } from "@/server/googleCalendar";
import { auth } from "@clerk/nextjs/server";

export default async function PatientRegistrationPageWithEvent({
  params,
}: {
  params: { eventId: string };
}) {
  const { userId, redirectToSignIn } = auth();
  if (!userId) return redirectToSignIn();

  const scheduleInfo: GoogleCalendarEvent = await getscheduleById(
    userId,
    params.eventId
  );

  const patientEmail = scheduleInfo.attendees.find(
    (attendee) => attendee.responseStatus === "needsAction"
  )?.email;
  const patientName = scheduleInfo.attendees.find(
    (attendee) => attendee.responseStatus === "needsAction"
  )?.displayName;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Cadastro de Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientForm
          defaultValues={{ name: patientName, email: patientEmail }}
        />
      </CardContent>
    </Card>
  );
}
