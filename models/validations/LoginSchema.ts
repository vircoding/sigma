import { z } from 'zod';

export type LoginSchema = z.output<typeof loginSchema>;

export const loginSchema = z.object({
  email: z
    .string({ message: 'Requerido' })
    .trim()
    .min(1, 'Requerido')
    .email('Debe ser un correo electrónico válido'),
  password: z
    .string({ message: 'Requerido' })
    .trim()
    .min(1, 'Requerido')
    .min(6, 'Debe contener entre 6 y 20 caracteres')
    .max(20, 'Debe contener entre 6 y 20 caracteres'),
});
