import { z } from 'zod';

export type SearchSchema = z.output<typeof searchSchema>;

export const searchSchema = z.object({
  type: z.enum(['sale', 'rent', 'exchange']),
});
