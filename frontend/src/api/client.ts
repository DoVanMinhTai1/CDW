import { API_BASE } from './constants';

async function handleResponse<T>(res: Response, raw?: boolean): Promise<T> {
  const text = await res.text();
  if (!text) return [] as unknown as T;
  try {
    const data = JSON.parse(text);
    console.log('API response data:', data);
    if (!raw && data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content as T;
    }
    return data as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function apiCall<T>(path: string, options: RequestInit & { raw?: boolean } = {}): Promise<T> {
  const { raw, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  if (fetchOptions.body != null && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  // Read token and trim possible surrounding quotes (some storage code may save quoted strings).
  let token = localStorage.getItem('authToken') ?? '';
  if (token) {
    token = token.replace(/^\"|\"$/g, '').trim();

    // Test if the token contains valid ISO-8859-1 characters before setting the header
    const isISO88591 = /^[\x00-\xFF]*$/.test(token);

    if (token && isISO88591) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('Invalid token format found in localStorage. Clearing token.');
      // localStorage.removeItem('authToken'); // Optional: clear the bad data
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  if (res.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth-unauthorized'));
  }

  if (!res.ok) {
    const errorData = await handleResponse<any>(res);
    // Throwing an actual Error object is safer for react-query / useMutation
    throw new Error(errorData?.message || `Request failed with status ${res.status}`);
  }

  return handleResponse<T>(res, raw);
}
