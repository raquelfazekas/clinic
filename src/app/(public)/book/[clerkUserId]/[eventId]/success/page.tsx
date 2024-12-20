import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle";
import { clerkClient } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function SuccessPage({
  params: { clerkUserId, eventId },
  searchParams: { startTime },
}: {
  params: { clerkUserId: string; eventId: string };
  searchParams: { startTime: string };
}) {
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
  });

  if (event == null) notFound();

  const calendarUser = await clerkClient().users.getUser(clerkUserId);
  const startTimeDate = new Date(startTime);

  const startTime2 = toZonedTime(startTimeDate, "America/Sao_Paulo");

  const formattedStartTime = format(startTime2, "dd/MM/yyyy, HH:mm")

  return (
    <Card className="max-w-xl mx-auto mt-16">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>
            {`${event.name} marcada com `}
            <span className="text-green-500">sucesso!</span>
          </CardTitle>
          <CardTitle>
            {" "}
            {`Dr(a)`}{" "}
            <span className="uppercase text-primary">
              {calendarUser.fullName}
            </span>
          </CardTitle>
        </div>
        <CardDescription>{formattedStartTime}</CardDescription>
      </CardHeader>
      <CardContent>
        Você deve receber um e-mail de confirmação em breve. Agora você pode
        fechar esta página com segurança.
      </CardContent>
    </Card>
  );
}
