/**
 * ECommerce API (ECommerceTest backend) ile iletişim
 * Vite proxy kullanıyorsanız baseUrl = '' (relative /api)
 * Proxy yoksa: baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5185'
 */
const baseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Products ---
export const productApi = {
  getAll: () => request<import('./apiTypes').ProductResponseDto[]>('/ProductApi'),
  getById: (id: string) =>
    request<import('./apiTypes').ProductResponseDto>(`/ProductApi/${id}`),
  create: (body: import('./apiTypes').ProductCreateDto) =>
    request<import('./apiTypes').ProductResponseDto>('/ProductApi', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: string, body: import('./apiTypes').ProductUpdateDto) =>
    request<void>(`/ProductApi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (id: string) =>
    request<void>(`/ProductApi/${id}`, { method: 'DELETE' }),
};

// --- Categories ---
export const categoryApi = {
  getAll: () =>
    request<import('./apiTypes').CategoryResponseDto[]>('/CategoryApi'),
  getById: (id: string) =>
    request<import('./apiTypes').CategoryResponseDto>(`/CategoryApi/${id}`),
  create: (body: import('./apiTypes').CategoryCreateDto) =>
    request<import('./apiTypes').CategoryResponseDto>('/CategoryApi', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: string, body: import('./apiTypes').CategoryUpdateDto) =>
    request<void>(`/CategoryApi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
};
