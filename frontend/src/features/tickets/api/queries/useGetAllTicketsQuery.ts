import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { Ticket, TicketsResponse } from '@/features/tickets/types/Ticket';

export const getAllTicketsQuery = () => {
	const getAllTickets = async (): Promise<Ticket[]> => {
		const response = await axiosInstance.get<TicketsResponse>('/api/v1/tickets');
		const data = response.data;
		return data.tickets;
	};

	return useQuery({
		queryKey: ['tickets'],
		queryFn: getAllTickets,
	});
};
