import { ScheduleForm } from "@/components/form/ScheduleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle";
import { auth } from "@clerk/nextjs/server";

export const revalidate = 0;

export default async function SchedulePage() {
  const { userId, redirectToSignIn } = auth();
  if (userId == null) return redirectToSignIn();

  const Schedule = await db.query.ScheduleTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    with: { availabilities: true },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ScheduleForm schedule={Schedule} />
      </CardContent>
    </Card>
  );
}
