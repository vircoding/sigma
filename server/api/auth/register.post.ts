import fs from 'fs';
import formidable from 'formidable';
import { H3Error } from 'h3';
import { ZodError } from 'zod';
import { ConflictError, UnexpectedError, BadRequestError } from '~/server/models/Error';
import {
  userTypeSchema,
  registerClientSchema,
  registerAgentSchema,
} from '~/server/models/ValSchema';

export default defineEventHandler(async (event) => {
  let cancelUploads = false;

  const form = formidable({
    keepExtensions: true,
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
  let user;

  try {
    // Parse the multipart form
    const { fields, files } = await parseMultipart(event, form).catch((error) => {
      if (error && typeof error === 'object' && 'code' in error)
        if (error.code === 1016)
          throw new BadRequestError('File exceeds the maximum allowed size of 5MB');

      throw new BadRequestError('Invalid multipart form');
    });

    if (cancelUploads) throw new BadRequestError('Invalid multipart form');

    // Parse the input
    let input;
    if (fields.input) input = JSON.parse(fields.input[0]);
    else throw new BadRequestError('Invalid multipart form');

    // Validate the user type
    let type: 'client' | 'agent';
    if (input.type) type = (await userTypeSchema.parseAsync({ type: input.type })).type;
    else throw new BadRequestError('Invalid multipart form');

    // Client
    if (type === 'client') {
      const data = await registerClientSchema.parseAsync(input);

      user = await registerClient(data);
    }

    // Agent
    else {
      const data = await registerAgentSchema.parseAsync(input);

      // Parse the avatar
      if (files.avatar) avatar = parseAvatar(files.avatar[0]);
      else throw new BadRequestError('Invalid multipart form');

      user = await registerAgent(data, avatar);
    }

    // Generate the verification token
    if (!user.verificationCode) throw new UnexpectedError();

    const verificationToken = generateVerificationToken({
      code: user.verificationCode.code,
      id: user.verificationCode.id,
      userId: user.id,
    });

    // Get the verification email
    const verificationEmailContent = await getVerificationEmail(verificationToken);

    // Send the verificaion email
    sendVerificationEmail(user.email, verificationEmailContent);

    return { success: true };
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

    // Conflict Error
    if (error instanceof ConflictError) {
      throw createError({
        status: 409,
        statusMessage: 'Conflict',
        message: 'User exists already',
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
