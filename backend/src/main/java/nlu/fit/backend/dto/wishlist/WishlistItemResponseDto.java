package nlu.fit.backend.dto.wishlist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponseDto {
    private Long wishlistId;     // ID của dòng ghi nhận trong bảng Wishlist để xử lý xóa
    private Long productId;      // ID của sản phẩm thực tế
    private String productName;  // Ví dụ: Seraphina Studs
    private String attributes;   // Chất liệu/Thông số: Platinum • Brilliant Cut
    private BigDecimal price;    // Giá tiền: $3,850
    private String thumbnailUrl;
}
