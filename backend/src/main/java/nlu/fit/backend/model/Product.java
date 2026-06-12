package nlu.fit.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Double weight;
    private String sku;
    private String slug;
    private Double carat;
    private String clarity;
    private String color;
    private String cut;
    private String size;
    private String gender;
    @Column(name = "original_url")
    private String originalUrl;
    @Column(name = "p_code")
    private String pCode;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "product")
    private List<Review> reviews;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    @ToString.Exclude
    private Material material;

    @Column(name = "featured")
    private Boolean featured = false;
}
