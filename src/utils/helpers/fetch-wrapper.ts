// src/utils/helpers/fetch-wrapper.ts
import { useAuthStore } from '@/stores/auth';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

function request(method: string) {
  return async (url: string, body?: object) => {
    const headers = getAuthHeader(url);

    const requestOptions: RequestOptions = {
      method,
      headers
    };

    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  };
}

// Auth Header helper
function getAuthHeader(url: string): Record<string, string> {
  try {
    const authStore = useAuthStore();
    const token = authStore.token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

    if (token && isApiUrl) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
  }
  return {};
}

function handleResponse<T = any>(response: Response): Promise<T> {
  return response.text().then((text: string) => {
    const json = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const authStore = useAuthStore();

      if ([401, 403].includes(response.status) && authStore.user) {
        authStore.logout();
      }

      const error: string = json?.message || response.statusText;
      return Promise.reject(error);
    }

    // Return 'data' property dari API response
    return json?.data;
  });
}
