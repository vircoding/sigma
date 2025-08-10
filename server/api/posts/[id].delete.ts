import fs from 'fs';
import { H3Error } from 'h3';
import { UnexpectedError, NotFoundError, ForbiddenError } from '~~/server/classes/Error';

export default defineEventHandler(async (event) => {
  try {
    // Get the userId
    const userId = event.context.userId as string;

    // Get the postId
    const postId = getRouterParam(event, 'id');
    if (!postId) throw new UnexpectedError();

    // Delete the post by id
    const removedImages = await deletePost(userId, postId);

    // Remove Images
    removedImages.forEach((item) => {
      try {
        fs.unlinkSync(item);
        console.log(item);
      } catch (error) {
        console.error('An error has ocurred while deleting an image\n', error);
      }
    });

    // Send the response
    return { ok: true };
  } catch (error) {
    // Not Found Error
    if (error instanceof NotFoundError) {
      throw createError({
        status: 404,
        statusMessage: 'Not Found',
        message: error.message,
      });
    }

    // Forbidden Error
    if (error instanceof ForbiddenError) {
      throw createError({
        status: 403,
        statusMessage: 'Forbidden',
        message: error.message,
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
