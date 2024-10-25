import { z } from "zod";

export const healthRecordTableSchema = z.object({
  visitDate: z
    .date()
    .transform((value) => new Date(value))
    .refine((date) => date <= new Date(), {
      message: "A data da visita não pode ser no futuro",
    }),
  notes: z.string().optional(),
  doctor: z.string().min(1, "Nome do médico é obrigatório"),
  createdAt: z
    .date()
    .transform((value) => new Date(value))
    .optional(),
  patientId: z.string().min(1, "ID do paciente é obrigatório"),
});
