import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';

export async function getCategories(): Promise<any[]> {
  return apiCall<any[]>(`${ENDPOINTS.CATEGORIES}`);
}

export const categoryService = { getCategories };