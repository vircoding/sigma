import fs from 'fs';
import formidable from 'formidable';
import { H3Error } from 'h3';
import { ZodError } from 'zod';
import { BadRequestError, NotAgentError, NotFoundError } from '~/models/classes/server/Error';
import { updateAgentSchema } from '~/models/schemas/server/UpdateAgentSchema';

export default defineEventHandler(async (event) => {
  let cancelUploads = false;

  const form = formidable({
    maxFields: 2,
    maxFiles: 1,
    maxTotalFileSize: 5 * 1024 * 1024,
    maxFileSize: 5 * 1024 * 1024,
    filter: function ({ mimetype }): boolean {
      if (mimetype) {
        const valid = !!mimetype && mimetype.includes('image');
        if (!valid) {
          cancelUploads = true;
        }
        return valid && !cancelUploads;
      } else cancelUploads = true;

      return !cancelUploads;
    },
  });

  let avatar: { path: string; url: string } | undefined = undefined;

  try {
    // Get the userId
    const userId = event.context.userId as string;

    // Find the user by id
    const user = await findUserById(userId);

    // Validate the type
    if (user.type !== 'agent') throw new NotAgentError('User is not an agent');

    // Parse the multipart form
    const { fields, files } = await parseMultipart(event, form).catch((error) => {
      if (error.code === 1016 || error.code === 1009)
        throw new BadRequestError('File exceeds the maximum allowed size of 5MB');

      throw new BadRequestError('Invalid multipart form');
    });

    if (cancelUploads) throw new BadRequestError('Invalid multipart form');

    // Parse the input
    let input;
    if (fields.input) input = JSON.parse(fields.input[0]);
    else throw new BadRequestError('Invalid multipart form');

    // Validate the input
    const data = await updateAgentSchema.parseAsync(input);

    // Parse the avatar
    if (files.avatar) avatar = parseAvatar(files.avatar[0]);

    // Update the user
    const updateData = await updateAgent(userId, data, avatar);

    // Remove the old Avatar if exists
    if (updateData.avatarWasUpdated && user.agent?.avatar?.path) {
      try {
        fs.unlinkSync(user.agent.avatar.path);
      } catch (error) {
        console.error('An error has ocurred while deleting an avatar\n', error);
      }
    }

    return { user: userTransformer(updateData.user) };
  } catch (error) {
    // Remove Avatar
    if (avatar) {
      try {
        fs.unlinkSync(avatar.path);
      } catch (error) {
        console.error('An error has ocurred while deleting an avatar\n', error);
      }
    }

    // Bad Request Error handler
    if (error instanceof BadRequestError) {
      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: error.message,
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

    // Not Agent Error
    if (error instanceof NotAgentError) {
      throw createError({
        status: 403,
        statusMessage: 'Forbidden',
        message: 'User is not an agent',
      });
    }

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
