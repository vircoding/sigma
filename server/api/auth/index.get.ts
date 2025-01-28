import { H3Error } from 'h3';
import { NotFoundError } from '~/models/classes/server/Error';

export default defineEventHandler(async (event) => {
  try {
    // Get the userId
    const userId = event.context.userId as string;

    // Find the user by id
    const user = await findUserById(userId);

    // Send the response
    return { user: userTransformer(user) };
  } catch (error) {
    // Not Found Error
    if (error instanceof NotFoundError) {
      throw createError({
        status: 404,
        statusMessage: 'Not Found',
        message: 'User not found',
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
