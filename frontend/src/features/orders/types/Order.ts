import { z } from 'zod';
import type { orderSchema } from '@/features/orders/schemas/orderSchema';

export type Order = z.infer<typeof orderSchema>;

export type OrdersResponse = {
	orders: Order[];
};
