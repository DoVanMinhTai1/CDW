package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.product.ProductDetailResponseDto;
import nlu.fit.backend.dto.product.ProductResponseDto;
import nlu.fit.backend.dto.product.ProductSearchRequest;
import nlu.fit.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;

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
}