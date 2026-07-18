import { z } from "zod";

export const requestSchema = z.object({
  name: z
    .string({ message: "Введите имя" })
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(80, "Имя должно содержать не более 80 символов"),
  email: z
    .email({ message: "Введите корректный email" })
    .trim()
    .max(80, "Email должен содержать не более 80 символов"),
  description: z
    .string({ message: "Опишите задачу" })
    .trim()
    .min(10, "Описание должно содержать минимум 10 символов")
    .max(1000, "Описание должно содержать не более 1000 символов"),
});

export type RequestInput = z.infer<typeof requestSchema>;
