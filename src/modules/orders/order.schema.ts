import { z } from 'zod';

export const OrderProductSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.number().int().positive('quantity must be greater than 0'),
});

export const orderCreateSchema = z.object({
  name: z.string().min(1, 'name is required'),
  phone: z.string().min(1, 'phone is required').max(12),
  scheduled: z.string(),
  orderItems: z.array(OrderProductSchema).min(1, 'At least one product is required'),
});

export const orderUpdateSchema = orderCreateSchema.partial();

export type orderCreateDto = z.infer<typeof orderCreateSchema>;
export type orderUpdateDto = z.infer<typeof orderUpdateSchema>;