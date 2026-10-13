import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { TicketsResponse } from "@/features/tickets/types/Ticket";

export const getAllTicketsQuery = () => {
	const getAllTickets = async (): Promise<TicketsResponse> => {
		const response = await axiosInstance.get<TicketsResponse>('/api/v1/tickets');
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['tickets'],
		queryFn: getAllTickets,
	});
};
