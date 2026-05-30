package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.wishlist.MoveToCartRequest;
import nlu.fit.backend.dto.wishlist.WishlistItemResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class WishlistController {

    /**
     * 1. API Lấy toàn bộ danh sách sản phẩm yêu thích của User hiện tại
     * Đổ dữ liệu lên màn hình "Danh Sách Yêu Thích"
     */
    @GetMapping
    public ResponseEntity<List<WishlistItemResponseDto>> getMyWishlist(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();

        // Logic thực tế:
        // - Tìm User từ email -> Tìm danh sách Wishlist của User đó trong DB.
        // - Chuyển đổi dữ liệu sang List<WishlistItemResponseDto>.

        return ResponseEntity.ok(List.of()); // Trả về danh sách sản phẩm yêu thích
    }

    /**
     * 2. API Xóa một sản phẩm khỏi danh sách yêu thích
     * Kích hoạt khi khách hàng nhấn vào dấu "X" ở góc trên bên phải mỗi Card sản phẩm
     */
    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable Long wishlistId,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();

        // Logic thực tế:
        // - Xác thực xem dòng wishlistId này có đúng là của người dùng đang đăng nhập không (Bảo mật).
        // - Thực hiện xóa bản ghi trong DB: wishlistRepository.deleteById(wishlistId);

        return ResponseEntity.ok("Đã loại bỏ sản phẩm khỏi danh sách yêu thích");
    }

    /**
     * 3. API Chuyển sản phẩm từ mục yêu thích vào Giỏ hàng (Move to Bag)
     * Kích hoạt khi bấm nút "Move to Bag". Hành động này bao gồm:
     * Thêm sản phẩm đó vào Giỏ hàng -> Sau đó tự động XÓA sản phẩm đó khỏi Wishlist.
     */
    @PostMapping("/move-to-cart")
    public ResponseEntity<String> moveToCart(
            @RequestBody MoveToCartRequest request,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();

        // Logic thực tế:
        // 1. Thêm sản phẩm vào giỏ hàng của User (Tương tự logic CartController):
        //    cartService.addItemToCart(email, request.getProductId(), request.getSize(), 1);
        //
        // 2. Xóa sản phẩm khỏi danh sách yêu thích để tránh trùng lặp:
        //    wishlistRepository.deleteByUserEmailAndProductId(email, request.getProductId());

        return ResponseEntity.ok("Sản phẩm đã được chuyển vào giỏ hàng thành công!");
    }
}