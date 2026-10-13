import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 5000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('access_token');
	if (token) {
		config.headers.set('Authorization', `Bearer ${token}`);
	}
	return config;
});
