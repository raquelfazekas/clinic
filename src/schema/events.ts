import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive("Duração tem que ser maior que 0")
    .max(60 * 12, `Duração tem que ser menor que 12 horas ${60 * 12} minutes`),
});
