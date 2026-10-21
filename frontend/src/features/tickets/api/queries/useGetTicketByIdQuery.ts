import { axiosInstance } from '@/axiosInstance';
import type { Ticket } from "@/features/tickets/types/Ticket"
import { useQuery } from '@tanstack/react-query';

export const useGetTicketByIdQuery = (id: Ticket['id']) => {
	const getTicket = async (): Promise<Ticket> => {
		const response = await axiosInstance.get<Ticket>(`/api/v1/tickets/${id}`);
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['ticket', id],
		queryFn: getTicket,
		enabled: !!id,
	});
};
