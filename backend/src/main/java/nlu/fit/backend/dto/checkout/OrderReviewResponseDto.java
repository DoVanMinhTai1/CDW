package nlu.fit.backend.dto.checkout;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderReviewResponseDto {
    private BigDecimal subTotal;     // Tiền hàng (€12,400.00)
    private String shippingMethod;   // "Complimentary"
    private BigDecimal shippingCost; // 0.00
    private BigDecimal estimatedTax; // Thuế tính toán động dựa theo quốc gia (€2,480.00)
    private BigDecimal total;        // Tổng tiền cuối (€14,880.00)
}