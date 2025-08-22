import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1, 'name is required'),
  description: z.string().max(500),
  price: z.string().min(1, 'price is required'),
  category: z.string().min(1, 'category is required'),
  imageUrl: z.string().url().optional(),
  status: z.boolean().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().cuid(),
});

export type CreateProductDto = z.infer<typeof productCreateSchema>;
export type UpdateProductDto = z.infer<typeof productUpdateSchema>;
