package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.checkout.AddressDto;
import nlu.fit.backend.dto.checkout.InitCheckoutRequest;
import nlu.fit.backend.dto.checkout.OrderReviewResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CheckoutController {

    /**
     * 1. API Lấy địa chỉ giao hàng mặc định của User (Nếu họ đã từng mua hàng hoặc lưu trong Profile)
     * Giúp tự động điền (Autofill) vào các ô First Name, Last Name, Street Address... khi vào trang này.
     */
    @GetMapping("/default-address")
    public ResponseEntity<AddressDto> getDefaultAddress(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        // Logic: Lấy thông tin User -> Tìm trong bảng UserAddress xem có địa chỉ nào mặc định không
        AddressDto address = new AddressDto(); // Giả lập dữ liệu trả về
        return ResponseEntity.ok(address);
    }

    /**
     * 2. API Tính toán lại tiền (Thuế, Ship) dựa trên Quốc gia / Địa chỉ nhập vào
     * Chạy ngầm khi Frontend thay đổi ô "Country" hoặc "Postal Code" để tính thuế (Estimated Tax) chính xác theo luật nước đó.
     */
    @PostMapping("/calculate-summary")
    public ResponseEntity<OrderReviewResponseDto> calculateOrderSummary(
            @RequestBody AddressDto shippingAddress,
            Authentication authentication) {

        // Logic:
        // - Lấy danh sách item hiện tại trong giỏ hàng để tính subTotal.
        // - Dựa vào shippingAddress.getCountry() để tính % thuế (Ví dụ: Pháp thuế VAT khác Mỹ).

        OrderReviewResponseDto summary = new OrderReviewResponseDto();
        // summary.setSubTotal(...);
        // summary.setEstimatedTax(...);
        // summary.setTotal(...);

        return ResponseEntity.ok(summary);
    }

    /**
     * 3. API Lưu thông tin bước 1-2 để chuyển sang bước 3 REVIEW (Khi bấm CONTINUE TO REVIEW)
     */
    @PostMapping("/continue")
    public ResponseEntity<String> continueToReview(
            @RequestBody InitCheckoutRequest request,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).body("Yêu cầu xác thực tài khoản");

        String userEmail = authentication.getName();

        // Logic:
        // - Kiểm tra tính hợp lệ của địa chỉ và phương thức thanh toán (Credit Card / Bank Transfer)
        // - Đóng gói thông tin này lưu vào trạng thái đơn hàng tạm thời (Draft Order) trong Database.
        // - Chuẩn bị sẵn sàng cấu trúc dữ liệu cho trang số 03 REVIEW tiếp theo.

        return ResponseEntity.ok("Thông tin vận chuyển và thanh toán hợp lệ. Chuyển sang bước Review.");
    }
}