import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { GoogleCalendarEvent } from "@/data/types";
import { getSchedulesDay } from "@/server/googleCalendar";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { CalendarArrowUp, CalendarRange } from "lucide-react";
import { AppointmentForm } from "@/components/form/AppointmentForm";
import { Button } from "@/components/ui/button";
import { toZonedTime } from "date-fns-tz";

export const revalidate = 0;

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const { userId, redirectToSignIn } = auth();
  if (userId == null) return redirectToSignIn();

  const selectedDate = searchParams.date || format(new Date(), "yyyy-MM-dd");
  const events: GoogleCalendarEvent[] = await getSchedulesDay(
    userId,
    selectedDate
  );

  const transformDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="flex flex-col gap-10 mx-auto">
      <div className="flex max-w-[32em] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              Agendamento do Dia {transformDate(selectedDate)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentForm selectedDate={selectedDate} />
          </CardContent>
        </Card>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {events.map((event: GoogleCalendarEvent) => {
            const [paciente, medico, evento] = event.summary.split(" ; ");

            const start = toZonedTime(
              new Date(event.start.dateTime),
              event.start.timeZone
            ).toLocaleString();
            const end = toZonedTime(
              new Date(event.end.dateTime),
              event.end.timeZone
            ).toLocaleString();

            const formattedStartTime = format(start, "dd/MM/yyyy, HH:mm");

            const formattedEndTime = format(end, "dd/MM/yyyy, HH:mm");

            return (
              <Card
                key={event.id}
                className="shadow-lg transition-transform transform hover:scale-105"
              >
                <CardHeader className="bg-primary text-white rounded-t-lg p-4">
                  <CardTitle className="text-xl font-semibold">
                    {medico}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 bg-white">
                  <div className="grid grid-cols-1 gap-2">
                    <p className="text-gray-700 font-medium">{paciente}</p>
                    <p className="text-gray-500">{evento}</p>
                    <p className="text-sm text-gray-600">
                      Início: {formattedStartTime} <br />
                      Fim: {formattedEndTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      {
                        event.attendees.find((attendee) => !attendee.organizer)
                          ?.email
                      }{" "}
                      <br />
                      {event.description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 bg-gray-100 rounded-b-lg">
                  <Link href={event.htmlLink}>
                    <Button className="text-white hover:bg-blue-600">
                      <CalendarArrowUp />
                    </Button>
                  </Link>
                  <Link href={`/attendance/${event.id}`}>
                    <Button className="bg-green-500 text-white hover:bg-green-600">
                      Iniciar atendimento
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-10 my-10">
          <p className="text-center text-gray-500">
            Nenhum agendamento encontrado para esta data.
          </p>
          <CalendarRange className="size-16 mx-auto text-gray-500" />
        </div>
      )}
    </div>
  );
}
