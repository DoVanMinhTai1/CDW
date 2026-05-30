package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.cart.*;
import nlu.fit.backend.dto.order.CheckoutRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    @GetMapping
    public ResponseEntity<CartSummaryResponseDto> getCart(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();

        // Logic: Lấy giỏ hàng từ DB theo User Email -> Tính toán Subtotal, Total -> Trả về Summary DTO
        CartSummaryResponseDto cartSummary = new CartSummaryResponseDto(); // Giả lập xử lý dữ liệu

        return ResponseEntity.ok(cartSummary);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartSummaryResponseDto> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody UpdateQuantityRequest request,
            Authentication authentication) {

        // Logic: Tìm dòng item theo cartItemId -> Cập nhật trường quantity = request.getQuantity() -> Lưu DB
        // Trả về CartSummaryResponseDto mới sau khi đã tự động tính lại tổng tiền để FE cập nhật UI ngay lập tức.

        return ResponseEntity.ok(new CartSummaryResponseDto());
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartSummaryResponseDto> removeItem(
            @PathVariable Long cartItemId,
            Authentication authentication) {

        // Logic: Xóa bản ghi item trong DB thông qua cartItemId
        // Trả về CartSummaryResponseDto mới sau khi xóa để FE reload lại danh sách mà không cần F5

        return ResponseEntity.ok(new CartSummaryResponseDto());
    }

    /**
     * 4. API Áp dụng mã giảm giá (Khi nhập code và nhấn APPLY)
     */
    @PostMapping("/promo/apply")
    public ResponseEntity<CartSummaryResponseDto> applyPromoCode(
            @RequestBody PromoRequest request,
            Authentication authentication) {

        String code = request.getPromoCode();
        // Logic: Kiểm tra xem mã giảm giá có hợp lệ/hết hạn không -> Tính lại discountAmount và estimatedTotal

        return ResponseEntity.ok(new CartSummaryResponseDto());
    }

    @PostMapping("/checkout/init")
    public ResponseEntity<String> proceedToCheckout(
            @RequestBody CheckoutRequest request,
            Authentication authentication) {

        // Logic: Lưu trường giftMessage vào thông tin giỏ hàng tạm thời của User trước khi sang trang thanh toán hóa đơn/vận chuyển

        return ResponseEntity.ok("Khởi tạo tiến trình checkout thành công!");
    }
}