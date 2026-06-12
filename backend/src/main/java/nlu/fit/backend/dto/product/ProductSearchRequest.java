package nlu.fit.backend.dto.product;

import lombok.Data;
import java.util.List;

@Data
public class ProductSearchRequest {
    private String search;
    private List<Long> categoryIds;
    private List<Long> materialIds;
    private Double minPrice;
    private Double maxPrice;
    private String sortBy;
    private Boolean featured;
    private int page = 0;
    private int size = 12;
}