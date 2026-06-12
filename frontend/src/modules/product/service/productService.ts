import { apiCall } from '../../../api/client';
import { ENDPOINTS } from '../../../api/constants';
import type { Product } from '../model';

function buildQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  const qs = new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  return `?${qs}`;
}

export async function getProducts(params?: Record<string, any>): Promise<Product[]> {
  const q = buildQuery(params);
  return apiCall<Product[]>(`${ENDPOINTS.PRODUCTS}${q}`);
}

export async function getProduct(id: string): Promise<Product> {
  return apiCall<Product>(`${ENDPOINTS.PRODUCTS}/${id}`);
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

export async function getNewArrivals(limit = 12): Promise<Product[]> {
  return getProducts({ sort: 'newest', limit });
}

export async function getTrendingProducts(limit = 12): Promise<Product[]> {
  return getProducts({ sort: 'trending', limit });
}

export const productService = { getProducts, getProduct, getFeaturedProducts, getNewArrivals, getTrendingProducts };
