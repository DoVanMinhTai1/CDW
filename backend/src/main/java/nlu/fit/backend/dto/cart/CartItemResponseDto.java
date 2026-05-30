package nlu.fit.backend.dto.cart;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemResponseDto {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private String attributes;
    private String thumbnailUrl;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subTotal;
}