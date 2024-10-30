import jwt from 'jsonwebtoken';

const verificationSign = useRuntimeConfig().jwtVerificationSecret;

// Verification token
export function generateVerificationToken(payload: { code: string; id: string; userId: string }) {
  return jwt.sign(payload, verificationSign, { expiresIn: '5m' });
}
