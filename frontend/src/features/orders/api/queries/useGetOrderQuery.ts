import { axiosInstance } from '@/axiosInstance';
import type { Order } from '@/features/orders/types/Order';
import { useQuery } from '@tanstack/react-query';

export const useGetOrderQuery = (id: Order['id']) => {
	const getOrder = async (): Promise<Order> => {
		const response = await axiosInstance.get<Order>(`/api/v1/orders/${id}`);
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['order', id],
		queryFn: getOrder,
		enabled: !!id,
	});
};
