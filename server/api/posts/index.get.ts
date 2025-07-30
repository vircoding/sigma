import { H3Error } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Get the userId
    const userId = event.context.userId as string;

    // Find user posts by userID
    const posts = await findUserPosts(userId);

    return { posts: userPostsTransformer(posts) };
  } catch (error) {
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
