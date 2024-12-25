import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';

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

// Insert Schema
export const insertSchema = z
  .object({
    amount: z
      .number({ message: 'Debe ser un precio válido' })
      .int('Debe ser un precio válido')
      .gte(1, 'Debe ser un precio válido')
      .lte(999999999, 'Debe ser un precio válido'),
    tax: z
      .number({ message: 'Debe ser una tarifa válida' })
      .int('Debe ser una tarifa válida')
      .gte(1, 'Debe ser una tarifa válida')
      .lte(999999999, 'Debe ser una tarifa válida'),
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
    description: z
      .string({ message: 'La Descripción no es válida' })
      .trim()
      .max(1250, 'No puede exceder de 1250 caracteres')
      .optional(),
    properties: z
      .object({
        bed: z
          .number({ message: 'Entre 0 y 9' })
          .int('Entre 0 y 9')
          .gte(0, 'Entre 0 y 9')
          .lte(9, 'Entre 0 y 9'),
        bath: z
          .number({ message: 'Entre 0 y 9' })
          .int('Entre 0 y 9')
          .gte(0, 'Entre 0 y 9')
          .lte(9, 'Entre 0 y 9'),
      })
      .array()
      .min(1)
      .max(3),
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

export type InsertSchema = z.output<typeof insertSchema>;
