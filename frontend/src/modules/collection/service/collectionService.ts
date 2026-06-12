import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { Collection, Product } from '../model';

export async function getCollections(): Promise<Collection[]> {
  return apiCall<Collection[]>(`${ENDPOINTS.COLLECTIONS}`);
}

export async function getProductsByCollection(id: string): Promise<Product[]> {
  return apiCall<Product[]>(`${ENDPOINTS.COLLECTIONS}/${id}/products`);
}

export const collectionService = { getCollections, getProductsByCollection };
