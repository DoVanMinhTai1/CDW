import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { User } from '../model';

export async function login(email: string, password: string): Promise<{ token: string; email: string; fullName: string; username: string }> {
  return apiCall(`${ENDPOINTS.AUTH}/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function register(payload: Partial<User> & { password: string }): Promise<User> {
  return apiCall<User>(`${ENDPOINTS.AUTH}/register`, { method: 'POST', body: JSON.stringify(payload) });
}

export function logout(): void {
  localStorage.removeItem('authToken');
}

export const authService = { login, register, logout };
