export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  COLLECTIONS: '/api/collections',
  CART: '/api/cart',
  ORDERS: '/api/orders',
  BANNERS: '/api/banners',
  CATEGORIES: '/api/categories',
  PROMOTIONS: '/api/promotions',
  RECOMMENDATIONS: '/api/recommendations'
} as const;
