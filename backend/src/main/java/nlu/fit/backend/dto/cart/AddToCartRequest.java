package nlu.fit.backend.dto.cart;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productId;
    private Integer size;
    private int quantity = 1;
}