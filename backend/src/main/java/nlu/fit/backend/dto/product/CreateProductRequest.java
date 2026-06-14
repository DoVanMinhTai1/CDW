package nlu.fit.backend.dto.product;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateProductRequest {
    private String name;
    private String collectionName;
    private BigDecimal price;
    private String description;
    private String thumbnailUrl;
    private Long categoryId;
    private String sku;
    private Integer stock;
}
