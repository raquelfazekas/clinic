import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSchedulesDay } from "@/server/googleCalendar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { GoogleCalendarEvent } from "@/data/types";
import Link from "next/link";
import { CalendarArrowUp } from "lucide-react";

export const revalidate = 0;

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const { userId } = auth();
  if (userId == null) return redirect("/sign-in");

  const selectedDate = searchParams.date || format(new Date(), "yyyy-MM-dd");
  const events = await getSchedulesDay(userId, selectedDate);

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
            <form
              method="get"
              action="/appointment"
              className="flex flex-col gap-4"
            >
              <label htmlFor="date">Escolha uma data:</label>
              <Input
                type="date"
                id="date"
                name="date"
                defaultValue={selectedDate}
                className="max-w-sm"
              />
              <Button type="submit" className="max-w-sm">
                Ver agendamentos
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {events.map((event: GoogleCalendarEvent) => {
            const [paciente, medico, evento] = event.summary.split(" ; ");

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
                      Início: {new Date(event.start.dateTime).toLocaleString()}{" "}
                      <br />
                      Fim: {new Date(event.end.dateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {event.attendees[0].email} <br />
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
        <p className="text-center text-gray-500">
          Nenhum agendamento encontrado para esta data.
        </p>
      )}
    </div>
  );
}
