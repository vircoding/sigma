import { z } from 'zod';

export const userTypeSchema = z.object({
  type: z.enum(['client', 'agent']),
});

export const verificationTokenSchema = z.string();

export const decodedVerificationTokenSchema = z.object({
  code: z.string(),
  id: z.string(),
  userId: z.string(),
});

export const refreshTokenSchema = z.string();

export const decodedRefreshTokenSchema = z.object({
  code: z.string(),
  id: z.string(),
  userId: z.string(),
});

export const accessTokenSchema = z.string();

export const decodedAccessTokenSchema = z.object({
  id: z.string(),
});

export const postTypeSchema = z.object({
  type: z.enum(['sale', 'rent', 'exchange']),
});

export const resendSchema = z.object({
  email: z.string().trim().min(1).email(),
});
