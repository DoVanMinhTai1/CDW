import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { Category, Material, PageResponse, ProductItem } from '../model';

export interface ProductFilters {
  search?: string;
  categoryIds?: number[];
  materialIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  size?: number;
}

export async function getProducts(filters: ProductFilters): Promise<PageResponse<ProductItem>> {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.categoryIds?.length) params.append('categoryIds', filters.categoryIds.join(','));
  if (filters.materialIds?.length) params.append('materialIds', filters.materialIds.join(','));
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.size !== undefined) params.append('size', filters.size.toString());

  const queryString = params.toString();
  const url = queryString ? `${ENDPOINTS.PRODUCTS}?${queryString}` : ENDPOINTS.PRODUCTS;
  
  return apiCall<PageResponse<ProductItem>>(url, { raw: true });
}

export async function getCategories(): Promise<Category[]> {
  return apiCall<Category[]>(`${ENDPOINTS.CATEGORIES}`);
}

export async function getMaterials(): Promise<Material[]> {
  return apiCall<Material[]>(`${ENDPOINTS.CATEGORIES}/materials`);
}

export const collectionService = { getProducts, getCategories, getMaterials };
