package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.wishlist.MoveToCartRequest;
import nlu.fit.backend.dto.wishlist.WishlistItemResponseDto;
import nlu.fit.backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItemResponseDto>> getMyWishlist(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        return ResponseEntity.ok(wishlistService.getMyWishlist(email));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<String> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        wishlistService.addToWishlist(email, productId);
        return ResponseEntity.ok("Sản phẩm đã được thêm vào danh sách yêu thích");
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long wishlistId,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        wishlistService.removeFromWishlist(wishlistId, email);
        return ResponseEntity.ok("Đã loại bỏ sản phẩm khỏi danh sách yêu thích");
    }

    @PostMapping("/move-to-cart")
    public ResponseEntity<String> moveToCart(
            @RequestBody MoveToCartRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        wishlistService.moveToCart(email, request);
        return ResponseEntity.ok("Sản phẩm đã được chuyển vào giỏ hàng thành công!");
    }
}