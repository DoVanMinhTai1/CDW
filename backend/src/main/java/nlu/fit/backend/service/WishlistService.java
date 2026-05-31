package nlu.fit.backend.service;

import nlu.fit.backend.dto.wishlist.MoveToCartRequest;
import nlu.fit.backend.dto.wishlist.WishlistItemResponseDto;

import java.util.List;

public interface WishlistService {
    List<WishlistItemResponseDto> getMyWishlist(String email);
    
    void addToWishlist(String email, Long productId);
    
    void removeFromWishlist(Long wishlistId, String email);
    
    void moveToCart(String email, MoveToCartRequest request);
}
