import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { CartItem } from '../model';

export async function getCart(): Promise<CartItem[]> {
  return apiCall<CartItem[]>(`${ENDPOINTS.CART}`);
}

export async function addToCart(item: CartItem): Promise<void> {
  await apiCall<void>(`${ENDPOINTS.CART}/add`, { method: 'POST', body: JSON.stringify(item) });
}

export async function removeFromCart(productId: string): Promise<void> {
  await apiCall<void>(`${ENDPOINTS.CART}/${productId}`, { method: 'DELETE' });
}

export async function getCartSummary(): Promise<{ itemCount: number; totalPrice: number }> {
  return apiCall<{ itemCount: number; totalPrice: number }>(`${ENDPOINTS.CART}/summary`);
}

export const cartService = { getCart, addToCart, removeFromCart, getCartSummary };
