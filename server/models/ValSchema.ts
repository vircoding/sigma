import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';
import { PROVINCES } from '~/server/models/Types';

export type ClientRegisterData = z.infer<typeof registerClientSchema>;
export type AgentRegisterData = z.infer<typeof registerAgentSchema>;
export type UserLoginData = z.infer<typeof loginSchema>;
export type AgentUpdateData = z.infer<typeof updateSchema>;
export type SaleInsertData = z.infer<typeof insertSaleSchema>;
export type RentInsertData = z.infer<typeof insertRentSchema>;
export type ExchangeInsertData = z.infer<typeof insertExchangeSchema>;

export const userTypeSchema = z.object({
  type: z.enum(['client', 'agent']),
});

export const registerClientSchema = z
  .object({
    type: z.literal('client'),
    email: z.string().trim().min(1),
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

export const verificationTokenSchema = z.string();

export const decodedVerificationTokenSchema = z.object({
  code: z.string(),
  id: z.string(),
  userId: z.string(),
});

export const resendSchema = z.object({
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

// RefreshToken
export const refreshTokenSchema = z.string();

export const decodedRefreshTokenSchema = z.object({
  code: z.string(),
  id: z.string(),
  userId: z.string(),
});

// Access Token
export const accessTokenSchema = z.string();

export const decodedAccessTokenSchema = z.object({
  id: z.string(),
});

export const updateSchema = z.object({
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

export const requestPasswordSchema = z.object({
  email: z.string().email(),
});

export const passwordCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    repassword: z.string(),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'],
  });

export const postTypeSchema = z.object({
  type: z.enum(['sale', 'rent', 'exchange']),
});

export const insertSaleSchema = z.object({
  type: z.literal('sale'),
  amount: z.number().int().gte(1).lte(999999999),
  currency: z.enum(['USD', 'CUP']),
  properties: z
    .object({
      address: z
        .object({
          province: z.enum([
            'Pinar del Río',
            'Artemisa',
            'La Habana',
            'Mayabeque',
            'Matanzas',
            'Villa Clara',
            'Cienfuegos',
            'Sancti Spíritus',
            'Ciego de Ávila',
            'Camagüey',
            'Las Tunas',
            'Holguín',
            'Granma',
            'Santiago de Cuba',
            'Guantánamo',
            'Isla de la Juventud',
          ]),
          municipality: z.string().trim(),
        })
        .refine((data) => getMunicipalities()[data.province].includes(data.municipality), {
          message: 'Must be a valid municipality',
          path: ['municipality'],
        }),
      features: z.object({
        bed: z.number().int().gte(0).lte(9),
        bath: z.number().int().gte(0).lte(9),
        garage: z.boolean(),
        garden: z.boolean(),
        pool: z.boolean(),
        furnished: z.boolean(),
      }),
    })
    .array()
    .length(1),
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

export const insertRentSchema = z.object({
  type: z.literal('rent'),
  amount: z.number().int().gte(1).lte(999999999),
  currency: z.enum(['USD', 'CUP']),
  frequency: z.enum(['daily', 'monthly']),
  properties: z
    .object({
      address: z
        .object({
          province: z.enum([
            'Pinar del Río',
            'Artemisa',
            'La Habana',
            'Mayabeque',
            'Matanzas',
            'Villa Clara',
            'Cienfuegos',
            'Sancti Spíritus',
            'Ciego de Ávila',
            'Camagüey',
            'Las Tunas',
            'Holguín',
            'Granma',
            'Santiago de Cuba',
            'Guantánamo',
            'Isla de la Juventud',
          ]),
          municipality: z.string().trim(),
        })
        .refine((data) => getMunicipalities()[data.province].includes(data.municipality), {
          message: 'Must be a valid municipality',
          path: ['municipality'],
        }),
      features: z.object({
        bed: z.number().int().gte(0).lte(9),
        bath: z.number().int().gte(0).lte(9),
        garage: z.boolean(),
        garden: z.boolean(),
        pool: z.boolean(),
        furnished: z.boolean(),
      }),
    })
    .array()
    .length(1),
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

export const insertExchangeSchema = z
  .object({
    type: z.literal('exchange'),
    needs: z.number().int().gte(0).lte(3),
    offers: z.number().int().gte(1).lte(3),
    properties: z
      .object({
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
          garage: z.boolean(),
          garden: z.boolean(),
          pool: z.boolean(),
          furnished: z.boolean(),
        }),
      })
      .array()
      .min(1)
      .max(3),
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
  })
  .refine((data) => data.offers === data.properties.length, {
    message: 'Property count and offers must match',
    path: ['offers'],
  });
