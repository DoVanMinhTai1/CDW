package nlu.fit.backend.service;

import nlu.fit.backend.dto.cart.AddToCartRequest;
import nlu.fit.backend.dto.cart.CartSummaryResponseDto;

public interface CartService {
    CartSummaryResponseDto getCartSummary(String email);
    
    CartSummaryResponseDto addItemToCart(String email, AddToCartRequest request);
    
    CartSummaryResponseDto updateItemQuantity(Long cartItemId, int quantity, String email);
    
    CartSummaryResponseDto removeItem(Long cartItemId, String email);
    
    CartSummaryResponseDto applyPromoCode(String promoCode, String email);
    
    void clearCart(Long userId);
}
