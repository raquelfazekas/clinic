import { Button } from "@/components/ui/button";
import { db } from "@/drizzle";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  const { userId, redirectToSignIn } = auth();
  if (userId == null) return redirectToSignIn();

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });



  return (
    <>
      <div className="flex gap-4 items-baseline">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
          Agendamentos
        </h1>
        <Button asChild>
          <Link href="/events/new">
            <CalendarPlus className="mr-4 size-6" />
            Novo Agendamento
          </Link>
        </Button>
      </div>
    </>
  );
}
