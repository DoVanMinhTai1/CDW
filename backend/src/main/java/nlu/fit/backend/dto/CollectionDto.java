package nlu.fit.backend.dto;

import lombok.Data;

@Data
public class CollectionDto {
    private Long id;
    private String name;
    private String slug;
    private String coverImage;
    private String description;
}
