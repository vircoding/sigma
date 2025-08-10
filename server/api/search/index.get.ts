import { H3Error } from 'h3';
import { ZodError } from 'zod';
import { BadRequestError, UnexpectedError } from '~~/server/classes/Error';
import { postTypeSchema } from '~~/server/schemas/GlobalSchema';
import {
  searchPageSchema,
  searchSaleSchema,
  searchRentSchema,
  searchExchangeSchema,
} from '~~/server/schemas/SearchSchema';

const limit = 12;

export default defineEventHandler(async (event) => {
  try {
    // Read the query
    const queryStr = getQuery(event);

    // Parse the query data
    let query;
    if (queryStr.data) {
      try {
        query = JSON.parse(queryStr.data as string);
        console.log(query);
      } catch (error) {
        if (error instanceof Error) throw new BadRequestError('Invalid query');
        throw new UnexpectedError();
      }
    } else query = { type: 'sale' };

    // Parse the page
    let page: number = 1;
    if (queryStr.page) page = await searchPageSchema.parseAsync(queryStr.page);

    // Validate the post type
    let type: PostType;
    if (query.type) type = (await postTypeSchema.parseAsync({ type: query.type })).type;
    else throw new BadRequestError('Invalid query');

    // Sale
    if (type === 'sale') {
      const filters = await searchSaleSchema.parseAsync(query);
      const posts = await searchSale(filters, { skip: (page - 1) * limit, take: limit });

      // Send the response
      return { posts: searchResultTransformer(posts) };
    }

    // Rent
    else if (type === 'rent') {
      const filters = await searchRentSchema.parseAsync(query);
      const posts = await searchRent(filters, { skip: (page - 1) * limit, take: limit });

      // Send the response
      return { posts: searchResultTransformer(posts) };
    }

    // Exchange
    else if (type === 'exchange') {
      const filters = await searchExchangeSchema.parseAsync(query);
      const posts = await searchExchange(filters, { skip: (page - 1) * limit, take: limit });

      // Send the response
      return { posts: searchResultTransformer(posts) };
    }

    throw new UnexpectedError();
  } catch (error) {
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
