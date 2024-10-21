"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function AppointmentForm({ selectedDate }: { selectedDate: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const date = formData.get("date");
    window.location.href = `/appointment?date=${date}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
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
      <Button
        type="submit"
        className="max-w-sm"
        disabled={isLoading} // Desabilita o botão durante o carregamento
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Ver agendamentos"}
      </Button>
    </form>
  );
}
