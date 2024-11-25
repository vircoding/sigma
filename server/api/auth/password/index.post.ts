import { H3Error } from 'h3';
import { ZodError } from 'zod';
import { BodyError, NotFoundError } from '~/server/models/Error';
import { requestPasswordSchema } from '~/server/models/ValSchema';

export default defineEventHandler(async (event) => {
  try {
    // Read the body of the request
    const input = await readBody(event);

    // Validate the body
    if (!input) throw new BodyError('Body is missing');

    // Validate the input
    const data = await requestPasswordSchema.parseAsync(input);

    // Create or update the password code
    const { user, passwordCode } = await upsertPasswordCode(data.email);

    // Get the password email
    const passwordEmailContent = await getPasswordEmail(passwordCode.code);

    // Send the password email
    sendPasswordEmail(user.email, passwordEmailContent);

    // Delete the password code after 2 minutes
    deletePasswordCode(passwordCode.id, 120000);

    // Send the success response
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
        data: {
          fields,
        },
      });
    }

    // Not Found Error
    if (error instanceof NotFoundError) {
      // Send the success response to avoid giving tips about registered users
      return { ok: true };
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
