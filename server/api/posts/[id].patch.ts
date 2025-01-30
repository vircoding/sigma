import fs from 'fs';
import formidable from 'formidable';
import { H3Error } from 'h3';
import { ZodError } from 'zod';
import {
  BadRequestError,
  MaxFileSizeImageError,
  NotFoundError,
  ForbiddenError,
  UnexpectedError,
} from '~/models/classes/server/Error';
import { postTypeSchema } from '~/models/schemas/server/GlobalSchema';
import {
  updateSaleSchema,
  updateRentSchema,
  updateExchangeSchema,
  mapSchema,
} from '~/models/schemas/server/UpdatePostSchema';

export default defineEventHandler(async (event) => {
  let cancelUploads = false;
  let imageErrorIndex = 0;
  const images: { path: string; url: string }[] = [];

  const form = formidable({
    maxFields: 3,
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

  form.on('file', () => {
    imageErrorIndex++;
  });

  try {
    // Get the userId
    const userId = event.context.userId as string;

    // Get the postId
    const postId = getRouterParam(event, 'id');
    if (!postId) throw new BadRequestError('Invalid or missing post id');

    // Parse the multipart form
    const { fields, files } = await parseMultipart(event, form).catch((error) => {
      if (error.code === 1016) {
        throw new MaxFileSizeImageError(
          'File exceeds the maximum allowed size of 5MB',
          imageErrorIndex,
        );
      }

      throw new BadRequestError('Invalid multipart form');
    });

    // Parse the input
    let input;
    if (fields.input) input = JSON.parse(fields.input[0]);
    else throw new BadRequestError('Invalid multipart form');

    // Validate the post type
    let type: 'sale' | 'rent' | 'exchange';
    if (input.type) type = (await postTypeSchema.parseAsync({ type: input.type })).type;
    else throw new BadRequestError('Invalid multipart form');

    // Parse the removed images array
    let map;
    if (fields.map) map = JSON.parse(fields.map[0]);
    else throw new BadRequestError('Invalid multipart form');

    // Parse images
    if (files.images) {
      files.images.forEach((item) => {
        images.push(parseImage(item));
      });
    }

    // Validate the map
    const parsedMap = await mapSchema.parseAsync(map);

    // Sale
    if (type === 'sale') {
      const data = await updateSaleSchema.parseAsync(input);
      const { updatedPost: post, removedImages } = await updateSale(
        userId,
        postId,
        data,
        images,
        parsedMap,
      );

      // Remove Old Images
      removedImages.forEach((item) => {
        try {
          fs.unlinkSync(item);
          console.log(item);
        } catch (error) {
          console.error('An error has ocurred while deleting an image\n', error);
        }
      });
      return { post: postTransformer(post) };
    }

    // Rent
    else if (type === 'rent') {
      const data = await updateRentSchema.parseAsync(input);
      const { updatedPost: post, removedImages } = await updateRent(
        userId,
        postId,
        data,
        images,
        parsedMap,
      );

      // Remove Old Images
      removedImages.forEach((item) => {
        try {
          fs.unlinkSync(item);
          console.log(item);
        } catch (error) {
          console.error('An error has ocurred while deleting an image\n', error);
        }
      });
      return { post: postTransformer(post) };
    }

    // Exchange
    else if (type === 'exchange') {
      const data = await updateExchangeSchema.parseAsync(input);
      const { updatedPost: post, removedImages } = await updateExchange(
        userId,
        postId,
        data,
        images,
        parsedMap,
      );

      // Remove Old Images
      removedImages.forEach((item) => {
        try {
          fs.unlinkSync(item);
          console.log(item);
        } catch (error) {
          console.error('An error has ocurred while deleting an image\n', error);
        }
      });
      return { post: postTransformer(post) };
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

    // Max File Size Image Error
    if (error instanceof MaxFileSizeImageError) {
      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: error.message,
        data: {
          index: error.index,
        },
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
