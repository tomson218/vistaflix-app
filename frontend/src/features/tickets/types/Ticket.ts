import type z from 'zod';
import type { ticketSchema } from '@/features/tickets/schemas/ticketSchema';

export type Ticket = z.infer<typeof ticketSchema>;

export type TicketsResponse = {
	tickets: Ticket[];
};
