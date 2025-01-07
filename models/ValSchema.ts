import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';
import { PROVINCES } from '~/server/models/Types';
import { getMunicipalities } from '~/server/utils/provinces';

// Register Client
export const registerClientSchema = z
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

export type RegisterClientSchema = z.output<typeof registerClientSchema>;

// Register Agent
export const registerAgentSchema = z
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
    avatar: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
    firstname: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .max(20, 'Debe contener hasta 20 caracteres')
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Este nombre no es válido',
      }),
    lastname: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .max(20, 'Debe contener hasta 20 caracteres')
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Los apellidos no son válidos',
      }),
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
    phone: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
    bio: z
      .string({ message: 'La biografía no es válida' })
      .trim()
      .max(250, 'No puede exceder de 250 caracteres')
      .optional(),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['repassword'],
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
  );

export type RegisterAgentSchema = z.output<typeof registerAgentSchema>;

// Login Schema
export const loginSchema = z.object({
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
});

export type LoginSchema = z.output<typeof loginSchema>;

// Update Agent
export const updateAgentSchema = z
  .object({
    firstname: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .max(20, 'Debe contener hasta 20 caracteres')
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Este nombre no es válido',
      }),
    lastname: z
      .string({ message: 'Requerido' })
      .trim()
      .min(1, 'Requerido')
      .max(20, 'Debe contener hasta 20 caracteres')
      .refine((data) => validator.isAlpha(data, 'es-ES', { ignore: ' ' }), {
        message: 'Los apellidos no son válidos',
      }),
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
    phone: z.string({ message: 'Requerido' }).trim().min(1, 'Requerido'),
    bio: z
      .string({ message: 'La biografía no es válida' })
      .trim()
      .max(250, 'No puede exceder de 250 caracteres')
      .optional(),
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
  );

export type UpdateAgentSchema = z.output<typeof updateAgentSchema>;

// Reset Password Schema
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

export type ResetPasswordSchema = z.output<typeof resetPasswordSchema>;

export type InsertSchema = z.output<typeof insertSchema>;

export const insertSchema = z.object({
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
    .max(10),
});

export const insertSaleSchema = z.object({
  type: z.literal('sale'),
  saleAmount: z.coerce
    .number({ message: 'Debe ser un precio válido' })
    .int('Debe ser un precio válido')
    .gte(1, 'Debe ser un precio válido')
    .lte(999999999, 'Debe ser un precio válido'),
  saleCurrency: z.enum(['USD', 'CUP']),
});

export const insertRentSchema = z.object({
  type: z.literal('rent'),
  rentTax: z.coerce
    .number({ message: 'Debe ser una tarifa válida' })
    .int('Debe ser una tarifa válida')
    .gte(1, 'Debe ser una tarifa válida')
    .lte(999999999, 'Debe ser una tarifa válida'),
  rentCurrency: z.enum(['USD', 'CUP']),
  rentFrequency: z.enum(['daily', 'monthly']),
});

export const insertExchangeSchema = z.object({
  type: z.literal('exchange'),
  exchangeOffers: z.number().int().gte(1).lte(3),
  exchangeNeeds: z.number().int().gte(0).lte(3),
});

export const insertPropertySchema = z.object({
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

export const insertSaleFormSchema = insertSchema.extend(insertSaleSchema.shape).extend({
  properties: z.object(insertPropertySchema.shape).array().length(1),
});

export type InsertSaleFormSchema = z.output<typeof insertSaleFormSchema>;

export const insertRentFormSchema = insertSchema.extend(insertRentSchema.shape).extend({
  properties: z.object(insertPropertySchema.shape).array().length(1),
});

export type InsertRentFormSchema = z.output<typeof insertRentFormSchema>;

export const insertExchangeFormSchema = insertSchema.extend(insertExchangeSchema.shape).extend({
  properties: z.object(insertPropertySchema.shape).array(),
});

export function getInsertExchangeFormSchema(propertyCount: 1 | 2 | 3) {
  return insertSchema.extend(insertExchangeSchema.shape).extend({
    properties: z.object(insertPropertySchema.shape).array().length(propertyCount),
  });
}

export type InsertExchangeFormSchema = z.output<typeof insertExchangeFormSchema>;
