import { useAuthStore } from '@/stores/auth';

export const fetchWrapper = {
  get: request<'GET'>('GET'),
  post: request<'POST'>('POST'),
  put: request<'PUT'>('PUT'),
  delete: request<'DELETE'>('DELETE'),
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

// Fungsi pembungkus untuk request dengan method tertentu
function request<M extends HttpMethod>(method: M) {
  return async <T = unknown>(url: string, body?: object): Promise<T> => {
    const headers = getAuthHeader(url);

    const requestOptions: RequestOptions = {
      method,
      headers,
    };

    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);
    return handleResponse<T>(response);
  };
}

// Mendapatkan Authorization header jika token tersedia
function getAuthHeader(url: string): Record<string, string> {
  try {
    const authStore = useAuthStore();
    const token = authStore.token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

    if (token && isApiUrl) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // ignore error, auth store belum tersedia
  }
  return {};
}

// Handler untuk response, termasuk auto-logout saat 401/403
async function handleResponse<T = unknown>(response: Response): Promise<T> {
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok) {
    try {
      const authStore = useAuthStore();
      if ([401, 403].includes(response.status) && authStore.user) {
        authStore.logout();
      }
    } catch {
      // ignore error, auth store belum tersedia
    }

    const errorMessage: string = json?.message || response.statusText;
    return Promise.reject(new Error(errorMessage));
  }

  // Return langsung json.data jika API response memiliki properti data
  return json?.data as T;
}
