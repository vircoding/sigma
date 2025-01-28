import { H3Error } from 'h3';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { RefreshTokenError } from '~/models/classes/server/Error';
import {
  decodedRefreshTokenSchema,
  refreshTokenSchema,
} from '~/models/schemas/server/GlobalSchema';

export default defineEventHandler(async (event) => {
  try {
    // Get the refresh token
    let refreshToken = getCookie(event, 'refresh_token');

    // Validate the refresh token
    refreshToken = await refreshTokenSchema.parseAsync(refreshToken);

    // Decode the refresh token
    const payload = decodeRefreshToken(refreshToken);

    // Validate the decoded refresh token
    const decodedRefreshToken = await decodedRefreshTokenSchema.parseAsync(payload);

    // Logout user
    await logoutUser(decodedRefreshToken.id, decodedRefreshToken.code);

    // Delete the refresh token
    deleteCookie(event, 'refresh_token');

    // Send the success response
    return { ok: true };
  } catch (error) {
    // Refresh Token Format Error handler
    if (error instanceof ZodError || error instanceof RefreshTokenError) {
      deleteCookie(event, 'refresh_token');

      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid or missing refresh token',
      });
    }

    // JsonWebToken Error handler
    if (error instanceof jwt.JsonWebTokenError) {
      deleteCookie(event, 'refresh_token');

      if (error instanceof jwt.TokenExpiredError) {
        throw createError({
          status: 401,
          statusMessage: 'Unauthorized',
          message: 'The refresh token has expired',
        });
      } else {
        throw createError({
          status: 400,
          statusMessage: 'Bad Request',
          message: 'Invalid or missing refresh token',
        });
      }
    }

    // H3 Error handler
    if (error instanceof H3Error) {
      throw error;
    }

    // Unhandled Error
    throw createError({
      status: 500,
      statusMessage: 'Internal Server Error',
      message: 'An unexpected error ocurred',
    });
  }
});
