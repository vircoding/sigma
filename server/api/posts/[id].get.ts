import { H3Error } from 'h3';
import { UnexpectedError, NotFoundError } from '~/models/classes/server/Error';

export default defineEventHandler(async (event) => {
  try {
    // Get the post Id
    const { id } = getRouterParams(event);
    if (!id) throw new UnexpectedError();

    // Find the post by id
    const post = await findPostById(id);

    // Send the response
    return { post: postTransformer(post) };
  } catch (error) {
    // Not Found Error
    if (error instanceof NotFoundError) {
      throw createError({
        status: 404,
        statusMessage: 'Not Found',
        message: 'Post not found',
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
