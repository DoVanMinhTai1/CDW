import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { Order } from '../model';

export async function createOrder(order: Order): Promise<Order> {
  return apiCall<Order>(`${ENDPOINTS.ORDERS}`, { method: 'POST', body: JSON.stringify(order) });
}

export async function getOrder(id: string): Promise<Order> {
  return apiCall<Order>(`${ENDPOINTS.ORDERS}/${id}`);
}

export const checkoutService = { createOrder, getOrder };
