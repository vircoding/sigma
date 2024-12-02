import fs from 'fs';
import formidable from 'formidable';
import { H3Error } from 'h3';
import { ZodError } from 'zod';
import {
  BadRequestError,
  MaxPostLengthError,
  UnexpectedError,
  NotFoundError,
} from '~/server/models/Error';
import {
  postTypeSchema,
  insertSaleSchema,
  insertRentSchema,
  insertExchangeSchema,
} from '~/server/models/ValSchema';

export default defineEventHandler(async (event) => {
  let cancelUploads = false;

  const form = formidable({
    maxFields: 2,
    maxFiles: 10,
    maxTotalFileSize: 10 * 5 * 1024 * 1024,
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

  const images: { path: string; url: string }[] = [];

  try {
    // Get the userId
    const userId = event.context.userId as string;

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

    // Validate the post type
    let type: 'sale' | 'rent' | 'exchange';
    if (input.type) type = (await postTypeSchema.parseAsync({ type: input.type })).type;
    else throw new BadRequestError('Invalid multipart form');

    // Parse images
    if (files.images) {
      files.images.forEach((item) => {
        images.push(parseImage(item));
      });
    } else throw new BadRequestError('Invalid multipart form');

    // Sale
    if (type === 'sale') {
      const data = await insertSaleSchema.parseAsync(input);
      const post = await insertSale(data, userId, images);
      return { postId: post.id };
    }

    // Rent
    else if (type === 'rent') {
      const data = await insertRentSchema.parseAsync(input);
      const post = await insertRent(data, userId, images);
      return { postId: post.id };
    }

    // Exchange
    else if (type === 'exchange') {
      const data = await insertExchangeSchema.parseAsync(input);
      const post = await insertExchange(data, userId, images);
      return { postId: post.id };
    }

    throw new UnexpectedError();
  } catch (error) {
    // Remove Images
    if (images.length !== 0) {
      images.forEach((item) => {
        try {
          fs.unlinkSync(item.path);
        } catch (error) {
          console.error('An error has ocurred while deleting an image\n', error);
        }
      });
    }

    // Bad Request Error handler
    if (error instanceof BadRequestError) {
      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: error.message,
      });
    }

    // Max Post Length Error handler
    if (error instanceof MaxPostLengthError) {
      throw createError({
        status: 403,
        statusMessage: 'Forbidden',
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
