import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';

export async function getPromotions(limit = 5): Promise<any[]> {
  return apiCall<any[]>(`${ENDPOINTS.PROMOTIONS}?limit=${limit}`);
}

export const promotionService = { getPromotions };