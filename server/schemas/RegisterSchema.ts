import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';

export type RegisterClientSchema = z.infer<typeof registerClientSchema>;
export type RegisterAgentSchema = z.infer<typeof registerAgentSchema>;

export const registerClientSchema = z
  .object({
    type: z.literal('client'),
    email: z.string().trim().min(1).email(),
    password: z.string().trim().min(6).max(20),
    repassword: z.string().trim().min(1),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'],
  });

export const registerAgentSchema = z
  .object({
    type: z.literal('agent'),
    email: z.string().trim().min(1).email(),
    password: z.string().trim().min(6).max(20),
    repassword: z.string().trim().min(1),
    firstname: z
      .string()
      .trim()
      .min(1)
      .max(20)
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Must only contain alphabetic characters and spaces',
      }),
    lastname: z
      .string()
      .trim()
      .min(1)
      .max(20)
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Must only contain alphabetic characters and spaces',
      }),
    bio: z.string().trim().max(250).optional(),
    phone: z
      .string()
      .trim()
      .min(1)
      .transform((value, ctx) => {
        const parsed = parsePhoneNumber(value);

        if (!parsed?.isValid()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a valid phone number',
          });

          return z.NEVER;
        }

        return parsed.number;
      }),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'],
  });
