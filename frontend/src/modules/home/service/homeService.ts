import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { Product } from '../model';

export async function getHomepageData(): Promise<{ featured: Product[] }> {
  const products = await apiCall<Product[]>(`${ENDPOINTS.PRODUCTS}?featured=true`);
  return { featured: products };
}
