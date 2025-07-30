import { z } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';
import { PROVINCES } from '~/models/types/Post';

export type UpdateSaleSchema = z.infer<typeof updateSaleSchema>;
export type UpdateRentSchema = z.infer<typeof updateRentSchema>;
export type UpdateExchangeSchema = z.infer<typeof updateExchangeSchema>;
export type MapSchema = z.infer<typeof mapSchema>;

const updatePartialSchema = z.object({
  description: z.string().trim().max(1250).optional(),
  whatsapp: z.boolean().optional(),
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
    })
    .optional(),
});

const updatePropertyPartialSchema = z.object({
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

const updateSalePartialSchema = z.object({
  type: z.literal('sale').optional(),
  amount: z.number().int().gte(1).lte(999999999).optional(),
  currency: z.enum(['USD', 'CUP']).optional(),
});

const updateRentPartialSchema = z.object({
  type: z.literal('rent').optional(),
  tax: z.number().int().gte(1).lte(999999999).optional(),
  currency: z.enum(['USD', 'CUP']).optional(),
  frequency: z.enum(['daily', 'monthly']).optional(),
});

const updateExchangePartialSchema = z.object({
  type: z.literal('exchange').optional(),
  needs: z.number().int().gte(0).lte(3).optional(),
  offers: z.number().int().gte(1).lte(3).optional(),
});

export const updateSaleSchema = updatePartialSchema.extend(updateSalePartialSchema.shape).extend({
  properties: z.object(updatePropertyPartialSchema.shape).array().length(1).optional(),
});

export const updateRentSchema = updatePartialSchema.extend(updateRentPartialSchema.shape).extend({
  properties: z.object(updatePropertyPartialSchema.shape).array().length(1).optional(),
});

export const updateExchangeSchema = updatePartialSchema
  .extend(updateExchangePartialSchema.shape)
  .extend({
    properties: z.object(updatePropertyPartialSchema.shape).array().min(1).max(3).optional(),
  });

export const mapSchema = z.object({
  new: z.number().array(),
  removed: z.number().array(),
});
