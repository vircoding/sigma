import { H3Error } from 'h3';
import { ZodError } from 'zod';
import { passwordCodeSchema } from '~/models/schemas/server/ResetPasswordSchema';
import { BodyError, PasswordCodeError } from '~/models/classes/server/Error';

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event);

    // Validate the body
    if (!input) throw new BodyError('Body is missing');

    // Validate the input
    const data = await passwordCodeSchema.parseAsync(input);

    // Validate the password code
    const user = await validatePasswordCode(data);

    // Unset the password pending code after 1.5 minutes
    unsetPendingPassword(user.id, 90000);

    return { ok: true };
  } catch (error) {
    // Body Error
    if (error instanceof BodyError) {
      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid JSON body',
      });
    }

    // Zod Error handler
    if (error instanceof ZodError) {
      const fields = error.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid or missing required parameters',
        data: { fields },
      });
    }

    // Password Code Error
    if (error instanceof PasswordCodeError) {
      throw createError({
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'Code validation fails',
      });
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
