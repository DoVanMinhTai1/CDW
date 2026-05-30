package nlu.fit.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String name;
    private String collectionName;
    private BigDecimal price;
    private String thumbnailUrl;
}