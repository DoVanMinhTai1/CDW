package nlu.fit.backend.repository;

import nlu.fit.backend.dto.product.ProductResponseDto;
import nlu.fit.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT new nlu.fit.backend.dto.product.ProductResponseDto(p.id, p.name, c.name, p.price, pi.url) " +
            "FROM Product p LEFT JOIN p.category c LEFT JOIN p.images pi ON pi.isPrimary = true " +
            "WHERE (CAST(:search AS string) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))) " +
            "AND (:categoryIds IS NULL OR p.category.id IN :categoryIds) " +
            "AND (:materialIds IS NULL OR p.material.id IN :materialIds) " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
            "AND (:featured IS NULL OR p.featured = :featured)")
    Page<ProductResponseDto> filterProducts(
            @Param("search") String search,
            @Param("categoryIds") List<Long> categoryIds,
            @Param("materialIds") List<Long> materialIds,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("featured") Boolean featured,
            Pageable pageable
    );

    @Query("SELECT new nlu.fit.backend.dto.product.ProductResponseDto(p.id, p.name, c.name, p.price, pi.url) " +
            "FROM Product p LEFT JOIN p.category c LEFT JOIN p.images pi ON pi.isPrimary = true " +
            "WHERE p.category.id = :categoryId AND p.id <> :excludeId")
    List<ProductResponseDto> findRelatedProducts(
            @Param("categoryId") Long categoryId,
            @Param("excludeId") Long excludeId,
            Pageable pageable
    );
}
