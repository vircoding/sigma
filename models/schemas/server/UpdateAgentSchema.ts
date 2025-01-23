import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';

export type UpdateAgentSchema = z.infer<typeof updateAgentSchema>;

export const updateAgentSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
      message: 'Must only contain alphabetic characters and spaces',
    })
    .optional(),
  lastname: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
      message: 'Must only contain alphabetic characters and spaces',
    })
    .optional(),
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
});
