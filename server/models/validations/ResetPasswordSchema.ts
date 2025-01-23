import { z } from 'zod';

export const requestPasswordSchema = z.object({
  email: z.string().trim().min(1).email(),
});

export const passwordCodeSchema = z.object({
  email: z.string().trim().min(1).email(),
  code: z.string().trim().length(6),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().min(1).email(),
    password: z.string().trim().min(6).max(20),
    repassword: z.string().trim().min(1),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'],
  });
