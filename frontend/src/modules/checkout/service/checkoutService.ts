import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { Order } from '../model';

export async function createOrder(order: any): Promise<Order> {
  return apiCall<Order>(`${ENDPOINTS.ORDERS}`, { method: 'POST', body: JSON.stringify(order) });
}

export async function getOrder(id: string): Promise<Order> {
  return apiCall<Order>(`${ENDPOINTS.ORDERS}/${id}`);
}

export async function getDefaultAddress(): Promise<any> {
  return apiCall<any>('/api/checkout/default-address');
}

export const checkoutService = { createOrder, getOrder, getDefaultAddress };
