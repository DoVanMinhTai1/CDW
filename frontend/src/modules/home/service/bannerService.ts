import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';

export async function getBanners(): Promise<any[]> {
  return apiCall<any[]>(`${ENDPOINTS.BANNERS}`);
}

export const bannerService = { getBanners };