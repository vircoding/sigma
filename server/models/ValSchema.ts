import { z } from 'zod';
import validator from 'validator';
import parsePhoneNumber from 'libphonenumber-js';

export type ClientRegisterData = z.infer<typeof registerClientSchema>;
export type AgentRegisterData = z.infer<typeof registerAgentSchema>;
export type UserLoginData = z.infer<typeof loginSchema>;
export type AgentUpdateData = z.infer<typeof updateSchema>;

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
      .refine(
        (data) => {
          const parsedPhoneNumber = parsePhoneNumber(data);
          if (!parsedPhoneNumber?.isValid()) return false;
          else return true;
        },
        { message: 'Must be a valid phone number' },
      ),
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
    .refine(
      (data) => {
        const parsedPhoneNumber = parsePhoneNumber(data);
        if (!parsedPhoneNumber?.isValid()) return false;
        else return true;
      },
      { message: 'Must be a valid phone number' },
    )
    .optional(),
});
