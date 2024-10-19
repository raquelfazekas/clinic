import { z } from "zod";

export const patientFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    dateOfBirth: z
        .date()
        .max(new Date(), "Data de nascimento não pode ser no futuro"),
    gender: z.string().min(1, "Gênero é obrigatório"),
    estado_civil: z.string().min(1, "Estado civil é obrigatório"),
    children: z.coerce
        .number()
        .int()
        .positive("Quantidade de filhos tem que ser maior que 0")
        .max(20, "Parabéns você atingiu o número máximo de filhos"),
    work: z.string().min(1, "Trabalho é obrigatório"),
    education: z.string().min(1, "Educação é obrigatória"),
    origin: z.string().min(1, "Origem é obrigatória"),
    religion: z.string().min(1, "Religião é obrigatória"),
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    phone: z.string().optional(),
    address: z.string().optional(),
    cpf: z.string()
        .min(1, "CPF é obrigatório")
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato XXX.XXX.XXX-XX"),
    socialName: z.string().optional(),
});
