package nlu.fit.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class PromotionDto {
    private Long id;
    private String name;
    private String type;
    private BigDecimal discount;
    private String discountType;
    private List<Long> productIds;
    private String bannerUrl;
    private Instant expiresAt;
}
