import { z } from 'zod';
import { PROVINCES } from '~/models/types/Post';

export type SearchSaleSchema = z.infer<typeof searchSaleSchema>;
export type SearchRentSchema = z.infer<typeof searchRentSchema>;
export type SearchExchangeSchema = z.infer<typeof searchExchangeSchema>;

export const searchPageSchema = z.coerce.number();

const searchPartialSchema = z.object({
  address: z
    .object({
      province: z.nativeEnum(PROVINCES),
      municipality: z.string().trim().optional(),
    })
    .refine(
      (data) => {
        if (data.municipality)
          return getMunicipalities()[data.province].includes(data.municipality);

        return true;
      },
      {
        message: 'Must be a valid municipality',
        path: ['municipality'],
      },
    )
    .optional(),
  features: z
    .object({
      bed: z
        .object({
          gte: z.coerce.number().int().gte(0).lte(9).optional(),
          lte: z.coerce.number().int().gte(0).lte(9).optional(),
        })
        .refine(
          (data) => {
            if (!data.gte && !data.lte) return false;
            return true;
          },
          { message: 'Must have gte or lte' },
        )
        .refine(
          (data) => {
            if (data.gte && data.lte) return data.lte >= data.gte;
            else return true;
          },
          {
            message: 'Must be a higher value',
            path: ['lte'],
          },
        )
        .optional(),
      bath: z
        .object({
          gte: z.coerce.number().int().gte(0).lte(9).optional(),
          lte: z.coerce.number().int().gte(0).lte(9).optional(),
        })
        .refine(
          (data) => {
            if (!data.gte && !data.lte) return false;
            return true;
          },
          { message: 'Must have gte or lte' },
        )
        .refine(
          (data) => {
            if (data.gte && data.lte) return data.lte >= data.gte;
            else return true;
          },
          {
            message: 'Must be a higher value',
            path: ['lte'],
          },
        )
        .optional(),
      backyard: z.boolean().optional(),
      balcony: z.boolean().optional(),
      garage: z.boolean().optional(),
      pool: z.boolean().optional(),
    })
    .optional(),
});

const searchSalePartialSchema = z.object({
  type: z.literal('sale'),
  amount: z
    .object({
      currency: z.enum(['USD', 'CUP']),
      gte: z.coerce.number().int().gte(1).lte(999999999).optional(),
      lte: z.coerce.number().int().gte(1).lte(999999999).optional(),
    })
    .refine(
      (data) => {
        if (!data.gte && !data.lte) return false;
        return true;
      },
      { message: 'Must have gte or lte' },
    )
    .refine(
      (data) => {
        if (data.gte && data.lte) return data.lte >= data.gte;
        else return true;
      },
      {
        message: 'Must be a higher value',
        path: ['lte'],
      },
    )
    .optional(),
});

const searchRentPartialSchema = z.object({
  type: z.literal('rent'),
  tax: z
    .object({
      currency: z.enum(['USD', 'CUP']),
      frequency: z.enum(['daily', 'monthly']),
      gte: z.coerce.number().int().gte(1).lte(999999999).optional(),
      lte: z.coerce.number().int().gte(1).lte(999999999).optional(),
    })
    .refine(
      (data) => {
        if (!data.gte && !data.lte) return false;
        return true;
      },
      { message: 'Must have gte or lte' },
    )
    .refine(
      (data) => {
        if (data.gte && data.lte) return data.lte >= data.gte;
        else return true;
      },
      {
        message: 'Must be a higher value',
        path: ['lte'],
      },
    )
    .optional(),
});

const searchExchangePartialSchema = z.object({
  type: z.literal('exchange'),
});

export const searchSaleSchema = searchPartialSchema.extend(searchSalePartialSchema.shape);
export const searchRentSchema = searchPartialSchema.extend(searchRentPartialSchema.shape);
export const searchExchangeSchema = searchPartialSchema.extend(searchExchangePartialSchema.shape);
