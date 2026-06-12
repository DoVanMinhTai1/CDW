import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';

export async function getRecommendations(limit = 8): Promise<any[]> {
  return apiCall<any[]>(`${ENDPOINTS.RECOMMENDATIONS}?limit=${limit}`);
}

export const recommendationService = { getRecommendations };