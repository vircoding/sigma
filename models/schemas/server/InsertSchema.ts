import { z } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';
import { PROVINCES } from '~/models/types/Post';

export type InsertSaleSchema = z.infer<typeof insertSaleSchema>;
export type InsertRentSchema = z.infer<typeof insertRentSchema>;
export type InsertExchangeSchema = z.infer<typeof insertExchangeSchema>;

const insertPartialSchema = z.object({
  description: z.string().trim().max(1250).optional(),
  whatsapp: z.boolean(),
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

const insertPropertyPartialSchema = z.object({
  address: z
    .object({
      province: z.nativeEnum(PROVINCES),
      municipality: z.string().trim(),
    })
    .refine((data) => getMunicipalities()[data.province].includes(data.municipality), {
      message: 'Must be a valid municipality',
      path: ['municipality'],
    }),
  features: z.object({
    bed: z.number().int().gte(0).lte(9),
    bath: z.number().int().gte(0).lte(9),
    backyard: z.boolean(),
    balcony: z.boolean(),
    garage: z.boolean(),
    pool: z.boolean(),
  }),
});

const insertSalePartialSchema = z.object({
  type: z.literal('sale'),
  amount: z.number().int().gte(1).lte(999999999),
  currency: z.enum(['USD', 'CUP']),
});

const insertRentPartialSchema = z.object({
  type: z.literal('rent'),
  tax: z.number().int().gte(1).lte(999999999),
  currency: z.enum(['USD', 'CUP']),
  frequency: z.enum(['daily', 'monthly']),
});

const insertExchangePartialSchema = z.object({
  type: z.literal('exchange'),
  needs: z.number().int().gte(0).lte(3),
  offers: z.number().int().gte(1).lte(3),
});

export const insertSaleSchema = insertPartialSchema.extend(insertSalePartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array().length(1),
});

export const insertRentSchema = insertPartialSchema.extend(insertRentPartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array().length(1),
});

export const insertExchangeSchema = insertPartialSchema
  .extend(insertExchangePartialSchema.shape)
  .extend({
    properties: z.object(insertPropertyPartialSchema.shape).array().min(1).max(3),
  });
