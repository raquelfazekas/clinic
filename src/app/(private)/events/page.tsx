import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
  return (
    <>
      <div>
        <h1>Events</h1>
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
