package nlu.fit.backend.dto;

import lombok.Data;

@Data
public class BannerDto {
    private Long id;
    private String imageUrl;
    private String link;
    private Integer priority;
}
