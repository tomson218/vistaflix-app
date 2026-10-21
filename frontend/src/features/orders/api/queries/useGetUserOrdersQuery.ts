import { axiosInstance } from '@/axiosInstance';
import type { User } from '@/features/users/types/User';
import { useQuery } from '@tanstack/react-query';
import type { OrdersResponse, Order } from '@/features/orders/types/Order';

export const useGetUserOrdersQuery = (id: User['id']) => {
	const getUserOrders = async (): Promise<Order[]> => {
		const response = await axiosInstance.get<OrdersResponse>(`/api/v1/orders/users/${id}`);
		const data = response.data;
		return data.orders;
	};

	return useQuery({
		queryKey: ['userOrders', id],
		queryFn: getUserOrders,
	});
};
