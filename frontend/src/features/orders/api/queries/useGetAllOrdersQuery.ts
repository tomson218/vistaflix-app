import { axiosInstance } from '@/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import type { OrdersResponse } from '@/features/orders/types/Order';

export const useGetAllOrdersQuery = () => {
	const getAllOrders = async (): Promise<OrdersResponse> => {
		const response = await axiosInstance.get<OrdersResponse>('/api/v1/orders');
		const data = response.data;
		return data;
	};

	return useQuery({
		queryKey: ['orders'],
		queryFn: getAllOrders,
	});
};
