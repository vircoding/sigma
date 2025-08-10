import { H3Error } from 'h3';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { RefreshTokenError } from '~~/server/classes/Error';
import { decodedRefreshTokenSchema, refreshTokenSchema } from '~~/server/schemas/GlobalSchema';

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

    // Refresh the session
    const { user, session } = await refreshSession(
      decodedRefreshToken.id,
      decodedRefreshToken.code,
    );

    // Generate the new refresh token
    refreshToken = generateRefreshToken({ code: session.code, id: session.id, userId: user.id });

    // Generate the new access token
    const accessToken = generateAccessToken({ id: user.id });

    // Send the refresh token
    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: true,
    });

    // Send the success response
    return {
      access_token: accessToken,
    };
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
