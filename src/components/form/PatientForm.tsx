"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { religions } from "@/data/constants";
import { educationLevels } from "@/data/constants";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { patientFormSchema } from "@/schema/patient";
import { createPatient } from "@/server/actions/patient";
import { useToast } from "@/hooks/use-toast";
import { formatCPF, formatPhone } from "@/lib/formatters";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface PatientFormProps {
  defaultValues?: {
    name?: string;
    email?: string;
  };
}

export function PatientForm({ defaultValues }: PatientFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      socialName: defaultValues?.name || "",
      children: 0,
      work: '',
    },
  });

  async function onSubmit(values: z.infer<typeof patientFormSchema>) {
    const res = await createPatient(values);

    if (res.error)
      return (
        <div className="text-muted-foreground text-xl">
          Erro ao salvar paciente
        </div>
      );

    toast({
      title: "Success",
      description: "Paciente cadastrado com sucesso!",
    });

    router.push(`/patient/${res.patientId}`);
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
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="socialName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nome Social</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => {
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value;
                if (inputValue.length >= 14) {
                  return;
                }
                const formattedValue = formatCPF(inputValue);
                field.onChange(formattedValue);
              };
              return (
                <FormItem className="flex-1">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value || ""}
                      onChange={handleChange}
                      placeholder="000.000.000-00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Gênero</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado_civil"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Estado Civil</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                      <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                      <SelectItem value="Divorciado(a)">
                        Divorciado(a)
                      </SelectItem>
                      <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="children"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Número de Filhos</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="work"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Profissão</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Escolaridade</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um nível de escolaridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Naturalidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Religião</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma religião" />
                    </SelectTrigger>
                    <SelectContent>
                      {religions.map((religion) => (
                        <SelectItem key={religion} value={religion}>
                          {religion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => {
              const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value;
                if (inputValue.replace(/\D/g, "").length >= 12) {
                  return;
                }

                const formattedValue = formatPhone(inputValue);
                field.onChange(formattedValue);
              };

              return (
                <FormItem className="flex-1">
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value || ""}
                      onChange={handleChange}
                      placeholder="(DD) 00000-0000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Cadastrar Paciente
          </Button>
        </div>
      </form>
    </Form>
  );
}
