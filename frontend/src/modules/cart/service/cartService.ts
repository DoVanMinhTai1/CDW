import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { CartItem, CartSummaryResponse } from '../model';

export async function getCart(): Promise<CartItem[]> {
  return apiCall<CartItem[]>(`${ENDPOINTS.CART}`);
}

// Add to cart (productId, optional size, quantity)
export async function addToCart(item: { productId: string; size?: number; quantity?: number }): Promise<void> {
  await apiCall<void>(`${ENDPOINTS.CART}/add`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

// Update quantity of an existing cart item
export async function updateItemQuantity(cartItemId: number, quantity: number): Promise<void> {
  await apiCall<void>(`${ENDPOINTS.CART}/items/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

// Remove a cart item
export async function removeItem(cartItemId: number): Promise<void> {
  await apiCall<void>(`${ENDPOINTS.CART}/items/${cartItemId}`, {
    method: 'DELETE',
  });
}

// Get full cart summary (includes totals, promo, etc.)
export async function getCartSummary(): Promise<CartSummaryResponse> {
  return apiCall<CartSummaryResponse>(`${ENDPOINTS.CART}`);
}

// Apply promo code
export async function applyPromoCode(promoCode: string): Promise<CartSummaryResponse> {
  return apiCall<CartSummaryResponse>(`${ENDPOINTS.CART}/promo/apply`, {
    method: 'POST',
    body: JSON.stringify({ promoCode }),
  });
}

export const cartService = {
  getCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  getCartSummary,
  applyPromoCode,
};
