package nlu.fit.backend.dto.wishlist;

import lombok.Data;

@Data
public class MoveToCartRequest {
    private Long productId;
    private Integer size; // Kích cỡ mặc định hoặc FE bắt chọn trước khi đẩy sang giỏ hàng
}