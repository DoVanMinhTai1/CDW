package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.cart.*;
import nlu.fit.backend.dto.order.CheckoutRequest;
import nlu.fit.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartSummaryResponseDto> getCart(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.getCartSummary(email));
    }

    @PostMapping("/add")
    public ResponseEntity<CartSummaryResponseDto> addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.addItemToCart(email, request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartSummaryResponseDto> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody UpdateQuantityRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.updateItemQuantity(cartItemId, request.getQuantity(), email));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartSummaryResponseDto> removeItem(
            @PathVariable Long cartItemId,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.removeItem(cartItemId, email));
    }

    @PostMapping("/promo/apply")
    public ResponseEntity<CartSummaryResponseDto> applyPromoCode(
            @RequestBody PromoRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(cartService.applyPromoCode(request.getPromoCode(), email));
    }

    @PostMapping("/checkout/init")
    public ResponseEntity<String> proceedToCheckout(
            @RequestBody CheckoutRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok("Khởi tạo tiến trình checkout thành công!");
    }
}