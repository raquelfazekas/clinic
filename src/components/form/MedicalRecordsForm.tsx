"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { healthRecordTableSchema } from "@/schema/medicalrecord";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  createMedicalRecords,
  updateMedicalRecords,
} from "@/server/actions/medicalRecords";
import { useUser } from "@clerk/nextjs";
import TextEditor from "../Text_editor";

export interface HealthRecordFormProps {
  defaultValues?: {
    id?: string;
    patientId: string;
    visitDate?: Date;
    notes?: string | null;
    doctor?: string;
  };
}

export function MedicalRecordsForm(
  { defaultValues }: HealthRecordFormProps,
) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof healthRecordTableSchema>>({
    resolver: zodResolver(healthRecordTableSchema),
    defaultValues: {
      ...defaultValues,
      visitDate: defaultValues?.visitDate || new Date(),
      notes: defaultValues?.notes || "",
      doctor: defaultValues?.doctor || "",
    },
  });

  useEffect(() => {
    if (user?.fullName && !form.getValues("doctor")) {
      form.setValue("doctor", user.fullName);
    }
  }, [user?.fullName, form]);

  async function onSubmit(values: z.infer<typeof healthRecordTableSchema>) {
    let res;

    console.log("hello")

    if (defaultValues?.id) {
      res = await updateMedicalRecords(values, defaultValues.id);
    } else {
      res = await createMedicalRecords(values);
    }

    // Check for success or error response
    if (res?.error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar prontuário",
      });
      return;
    }

    toast({
      title: "Success",
      description: defaultValues?.id
        ? "Prontuário atualizado com sucesso!"
        : "Prontuário criado com sucesso!",
    });

  

    router.push(`/patient/records/${defaultValues?.patientId}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="visitDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Data da Visita</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={format(new Date(field.value || ""), "yyyy-MM-dd")}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctor"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Médico</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do médico" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anotações</FormLabel>
              <FormControl>
                <TextEditor
                  value={field.value as string}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {defaultValues?.id ? "Atualizar Prontuário" : "Criar Prontuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
