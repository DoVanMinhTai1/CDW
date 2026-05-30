package nlu.fit.backend.dto.cart;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CartSummaryResponseDto {
    private List<CartItemResponseDto> items;
    private BigDecimal subTotal;       // Tổng tiền hàng ($16,600.00)
    private String shippingMethod;     // Ví dụ: "COMPLIMENTARY" (Miễn phí)
    private BigDecimal shippingCost;   // 0.00
    private String appliedPromoCode;   // Mã giảm giá đã áp dụng (nếu có)
    private BigDecimal discountAmount; // Số tiền được giảm
    private BigDecimal estimatedTotal; // Tổng tiền cuối cùng phải trả sau giảm giá
}