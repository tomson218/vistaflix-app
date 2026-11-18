import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
	_sessionRetried?: boolean;
	_csrfRetried?: boolean;
};

const CSRF_URL = '/api/v1/auth/csrf';
const REFRESH_URL = '/api/v1/auth/refresh';
const URLS_WITHOUT_SESSION_RETRY = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/logout', REFRESH_URL];
const SAFE_METHODS = ['get', 'head', 'options'];

export const axiosInstance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 5000,
	withCredentials: true,
});

let csrfTokenRequest: Promise<string> | null = null;
let refreshRequest: Promise<void> | null = null;

const getCsrfToken = (): Promise<string> => {
	csrfTokenRequest ??= axiosInstance
		.get<{ token: string }>(CSRF_URL)
		.then((response) => response.data.token)
		.catch((error: unknown) => {
			csrfTokenRequest = null;
			throw error;
		});

	return csrfTokenRequest;
};

const refreshSession = (): Promise<void> => {
	refreshRequest ??= axiosInstance
		.post(REFRESH_URL)
		.then(() => undefined)
		.finally(() => {
			refreshRequest = null;
		});

	return refreshRequest;
};

axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
	if (!SAFE_METHODS.includes(config.method?.toLowerCase() ?? 'get')) {
		config.headers.set('X-CSRF-Token', await getCsrfToken());
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<{ code?: string }>) => {
		const request = error.config as RetriableRequestConfig | undefined;

		if (!request) {
			throw error;
		}

		if (error.response?.status === 403 && error.response.data?.code === 'invalid_csrf_token' && !request._csrfRetried) {
			request._csrfRetried = true;
			csrfTokenRequest = null;
			return axiosInstance(request);
		}

		if (
			error.response?.status === 401 &&
			!request._sessionRetried &&
			!URLS_WITHOUT_SESSION_RETRY.includes(request.url ?? '')
		) {
			request._sessionRetried = true;
			await refreshSession();
			return axiosInstance(request);
		}

		throw error;
	},
);
