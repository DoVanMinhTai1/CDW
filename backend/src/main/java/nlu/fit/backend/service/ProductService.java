package nlu.fit.backend.service;

import nlu.fit.backend.dto.product.CreateProductRequest;
import nlu.fit.backend.dto.product.ProductDetailResponseDto;
import nlu.fit.backend.dto.product.ProductResponseDto;
import nlu.fit.backend.dto.product.ProductSearchRequest;
import org.springframework.data.domain.Page;

public interface ProductService {
    Page<ProductResponseDto> getFilteredProducts(ProductSearchRequest request);
    
    ProductDetailResponseDto getProductDetail(Long id);

    ProductResponseDto createProduct(CreateProductRequest request);

    ProductResponseDto updateProduct(Long id, CreateProductRequest request);

    void deleteProduct(Long id);
}
