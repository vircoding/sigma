import { z } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';
import { PROVINCES } from '~/models/types/Post';
import { getMunicipalities } from '~/server/utils/provinces';

export type InsertSaleSchema = z.output<typeof insertSaleSchema>;
export type InsertRentSchema = z.output<typeof insertRentSchema>;
export type InsertExchangeSchema = z.output<typeof _insertExchangeSchema>;
export type InsertSchema = InsertSaleSchema | InsertRentSchema | InsertExchangeSchema;

const insertPartialSchema = z.object({
  whatsapp: z.boolean(),
  phone: z
    .object({
      code: z
        .string({ message: 'Requerido' })
        .trim()
        .refine(
          (data) => {
            const regex = /^\+\d+$/;
            if (data.length > 3) return false;
            if (!regex.test(`+${data}`)) return false;
            return true;
          },
          { message: 'El código no es válido' },
        ),
      phone: z
        .string({ message: 'Requerido' })
        .trim()
        .min(1, 'Requerido')
        .max(17, 'Debe ser un teléfono válido'),
    })
    .refine(
      (data) => {
        const parsedPhoneNumber = parsePhoneNumber(`+${data.code}${data.phone}`);
        if (!parsedPhoneNumber?.isValid()) return false;
        else return true;
      },
      {
        message: 'Debe ser un teléfono válido',
        path: ['phone'],
      },
    ),
  description: z
    .string({ message: 'La Descripción no es válida' })
    .trim()
    .max(1250, 'No puede exceder de 1250 caracteres')
    .optional(),
  images: z
    .object({
      imageURL: z.string(),
      blob: z.instanceof(Blob),
    })
    .array()
    .min(1, 'Debe contener al menos 1 imagen')
    .max(10, 'Máximo 10 imágenes'),
});

const insertSalePartialSchema = z.object({
  type: z.literal('sale'),
  saleAmount: z.coerce
    .number({ message: 'Debe ser un precio válido' })
    .int('Debe ser un precio válido')
    .gte(1, 'Debe ser un precio válido')
    .lte(999999999, 'Debe ser un precio válido'),
  saleCurrency: z.enum(['USD', 'CUP']),
});

const insertRentPartialSchema = z.object({
  type: z.literal('rent'),
  rentTax: z.coerce
    .number({ message: 'Debe ser una tarifa válida' })
    .int('Debe ser una tarifa válida')
    .gte(1, 'Debe ser una tarifa válida')
    .lte(999999999, 'Debe ser una tarifa válida'),
  rentCurrency: z.enum(['USD', 'CUP']),
  rentFrequency: z.enum(['daily', 'monthly']),
});

const insertExchangePartialSchema = z.object({
  type: z.literal('exchange'),
  exchangeOffers: z.number().int().gte(1).lte(3),
  exchangeNeeds: z.number().int().gte(0).lte(3),
});

const insertPropertyPartialSchema = z.object({
  address: z
    .object({
      province: z.nativeEnum(PROVINCES),
      municipality: z.string(),
    })
    .refine((data) => getMunicipalities()[data.province].includes(data.municipality), {
      message: 'Must be a valid municipality',
      path: ['municipality'],
    }),
  features: z.object({
    bed: z.coerce
      .number({ message: 'Entre 0 y 9' })
      .int('Entre 0 y 9')
      .gte(0, 'Entre 0 y 9')
      .lte(9, 'Entre 0 y 9'),
    bath: z.coerce
      .number({ message: 'Entre 0 y 9' })
      .int('Entre 0 y 9')
      .gte(0, 'Entre 0 y 9')
      .lte(9, 'Entre 0 y 9'),
    backyard: z.boolean(),
    balcony: z.boolean(),
    garage: z.boolean(),
    pool: z.boolean(),
  }),
});

export const insertSaleSchema = insertPartialSchema.extend(insertSalePartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array().length(1),
});

export const insertRentSchema = insertPartialSchema.extend(insertRentPartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array().length(1),
});

const _insertExchangeSchema = insertPartialSchema.extend(insertExchangePartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array(),
});

export function getInsertExchangeSchema(propertyCount: 1 | 2 | 3) {
  return insertPartialSchema.extend(insertExchangePartialSchema.shape).extend({
    properties: z.object(insertPropertyPartialSchema.shape).array().length(propertyCount),
  });
}
