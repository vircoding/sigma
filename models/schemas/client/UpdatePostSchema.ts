import { z } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';
import { PROVINCES } from '~/models/types/Post';
import { getMunicipalities } from '~/server/utils/provinces';

export type UpdateSaleSchema = z.output<typeof updateSaleSchema>;
export type UpdateRentSchema = z.output<typeof updateRentSchema>;
export type UpdateExchangeSchema = z.output<typeof _updateExchangeSchema>;

const updatePartialSchema = z.object({
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
    .max(10, 'Máximo 10 imágenes'),
});

const updateSalePartialSchema = z.object({
  amount: z.coerce
    .number({ message: 'Debe ser un precio válido' })
    .int('Debe ser un precio válido')
    .gte(1, 'Debe ser un precio válido')
    .lte(999999999, 'Debe ser un precio válido'),
  currency: z.enum(['USD', 'CUP']),
});

const updateRentPartialSchema = z.object({
  tax: z.coerce
    .number({ message: 'Debe ser una tarifa válida' })
    .int('Debe ser una tarifa válida')
    .gte(1, 'Debe ser una tarifa válida')
    .lte(999999999, 'Debe ser una tarifa válida'),
  currency: z.enum(['USD', 'CUP']),
  frequency: z.enum(['daily', 'monthly']),
});

const updateExchangePartialSchema = z.object({
  offers: z.number().int().gte(1).lte(3),
  needs: z.number().int().gte(0).lte(3),
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
    garage: z.boolean(),
    garden: z.boolean(),
    pool: z.boolean(),
    furnished: z.boolean(),
  }),
});

export const updateSaleSchema = updatePartialSchema.extend(updateSalePartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array().length(1),
});

export const updateRentSchema = updatePartialSchema.extend(updateRentPartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array().length(1),
});

const _updateExchangeSchema = updatePartialSchema.extend(updateExchangePartialSchema.shape).extend({
  properties: z.object(insertPropertyPartialSchema.shape).array(),
});

export function getUpdateExchangeSchema(propertyCount: 1 | 2 | 3) {
  return updatePartialSchema.extend(updateExchangePartialSchema.shape).extend({
    properties: z.object(insertPropertyPartialSchema.shape).array().length(propertyCount),
  });
}
