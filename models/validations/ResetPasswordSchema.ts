import { z } from 'zod';

export type ResetPasswordSchema = z.output<typeof resetPasswordSchema>;

export const resetPasswordSchema = z
  .object({
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
    repassword: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['repassword'],
  });
