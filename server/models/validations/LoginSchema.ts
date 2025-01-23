import { z } from 'zod';

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(6).max(20),
});
