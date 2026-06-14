import { apiCall } from '../../../api/client';

export const wishlistService = {
  async getMyWishlist() {
    return await apiCall<any[]>('/wishlist', {
      method: 'GET',
      raw: true
    });
  },

  async addToWishlist(productId: number | string) {
    return await apiCall<any>(`/wishlist/${productId}`, {
      method: 'POST',
      raw: true
    });
  },

  async removeFromWishlist(wishlistId: number | string) {
    return await apiCall<any>(`/wishlist/${wishlistId}`, {
      method: 'DELETE',
      raw: true
    });
  },

  async moveToCart(wishlistIds: (number | string)[]) {
    return await apiCall<any>('/wishlist/move-to-cart', {
      method: 'POST',
      body: JSON.stringify({ wishlistIds }),
      raw: true
    });
  }
};
