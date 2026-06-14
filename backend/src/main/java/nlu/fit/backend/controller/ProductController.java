package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.product.CreateProductRequest;
import nlu.fit.backend.dto.product.ProductDetailResponseDto;
import nlu.fit.backend.dto.product.ProductResponseDto;
import nlu.fit.backend.dto.product.ProductSearchRequest;
import nlu.fit.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponseDto>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<Long> categoryIds,
            @RequestParam(required = false) List<Long> materialIds,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false, name = "limit") Integer limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        ProductSearchRequest req = new ProductSearchRequest();
        req.setSearch(search);
        req.setCategoryIds(categoryIds);
        req.setMaterialIds(materialIds);
        req.setMinPrice(minPrice);
        req.setMaxPrice(maxPrice);
        req.setSortBy(sortBy);
        req.setFeatured(featured);
        req.setPage(page);
        if (limit != null && limit > 0) req.setSize(limit);
        else req.setSize(size);

        Page<ProductResponseDto> result = productService.getFilteredProducts(req);
        System.out.println(productService.getFilteredProducts(req));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<ProductResponseDto>> getFilteredProducts(@RequestBody ProductSearchRequest request) {
        Page<ProductResponseDto> result = productService.getFilteredProducts(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponseDto> getProductDetail(@PathVariable Long id) {
        ProductDetailResponseDto detailDto = productService.getProductDetail(id);
        return ResponseEntity.ok(detailDto);
    }

    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(@RequestBody CreateProductRequest request) {
        ProductResponseDto result = productService.createProduct(request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @RequestBody CreateProductRequest request) {
        ProductResponseDto result = productService.updateProduct(id, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Sản phẩm đã được xóa thành công!");
    }
}