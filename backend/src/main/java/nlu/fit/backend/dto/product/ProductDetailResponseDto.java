package nlu.fit.backend.dto.product;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDetailResponseDto {
    private Long id;
    private String name;
    private String collectionName;
    private BigDecimal price;
    private String description;
    private List<String> images;
    private List<Integer> availableSizes;
    private List<ProductResponseDto> relatedProducts;
}
