package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.product.CreateProductRequest;
import nlu.fit.backend.dto.product.ProductDetailResponseDto;
import nlu.fit.backend.dto.product.ProductResponseDto;
import nlu.fit.backend.dto.product.ProductSearchRequest;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.Product;
import nlu.fit.backend.model.ProductImage;
import nlu.fit.backend.repository.ProductRepository;
import nlu.fit.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<ProductResponseDto> getFilteredProducts(ProductSearchRequest request) {
        Sort sort = Sort.by("id").descending();
        if (request.getSortBy() != null) {
            switch (request.getSortBy()) {
                case "price_asc" -> sort = Sort.by("price").ascending();
                case "price_desc" -> sort = Sort.by("price").descending();
                case "newest", "featured" -> sort = Sort.by("id").descending();
            }
        }

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        List<Long> categoryIds = (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) ? request.getCategoryIds() : null;
        List<Long> materialIds = (request.getMaterialIds() != null && !request.getMaterialIds().isEmpty()) ? request.getMaterialIds() : null;
        String search = (request.getSearch() != null && !request.getSearch().trim().isEmpty()) ? request.getSearch().trim() : null;

        BigDecimal minPrice = request.getMinPrice() != null ? BigDecimal.valueOf(request.getMinPrice()) : null;
        BigDecimal maxPrice = request.getMaxPrice() != null ? BigDecimal.valueOf(request.getMaxPrice()) : null;

        return productRepository.filterProducts(
                search,
                categoryIds,
                materialIds,
                minPrice,
                maxPrice,
                request.getFeatured(),
                pageable
        );
    }

    @Override
    public ProductDetailResponseDto getProductDetail(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));

        ProductDetailResponseDto detailDto = new ProductDetailResponseDto();
        detailDto.setId(product.getId());
        detailDto.setName(product.getName());
        detailDto.setCollectionName(product.getCategory() != null ? product.getCategory().getName() : null);
        detailDto.setPrice(product.getPrice());
        detailDto.setDescription(product.getDescription());

        if (product.getImages() != null) {
            detailDto.setImages(product.getImages().stream()
                    .map(ProductImage::getUrl)
                    .collect(Collectors.toList()));
        } else {
            detailDto.setImages(Collections.emptyList());
        }

        detailDto.setAvailableSizes(List.of(5, 6, 7, 8, 9));

        if (product.getCategory() != null) {
            Pageable limit4 = PageRequest.of(0, 4);
            List<ProductResponseDto> related = productRepository.findRelatedProducts(
                    product.getCategory().getId(),
                    product.getId(),
                    limit4
            );
            detailDto.setRelatedProducts(related);
        } else {
            detailDto.setRelatedProducts(Collections.emptyList());
        }

        return detailDto;
    }

    @Override
    public ProductResponseDto createProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(BigDecimal.valueOf(Double.parseDouble(String.valueOf(request.getPrice()))));
        product.setDescription(request.getDescription());
        product.setSku(request.getSku());
        product.setStock(Integer.parseInt(String.valueOf(request.getStock())));

        // Set thumbnail as product image
        if (request.getThumbnailUrl() != null && !request.getThumbnailUrl().isEmpty()) {
            ProductImage image = new ProductImage();
            image.setUrl(request.getThumbnailUrl());
            image.setProduct(product);
            product.setImages(List.of(image));
        }

        Product savedProduct = productRepository.save(product);
        return mapToResponseDto(savedProduct);
    }

    @Override
    public ProductResponseDto updateProduct(Long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));

        product.setName(request.getName());
        if (request.getPrice() != null) product.setPrice(BigDecimal.valueOf(Double.parseDouble(String.valueOf(request.getPrice()))));
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getSku() != null) product.setSku(request.getSku());
        if (request.getStock() != null) product.setStock(Integer.parseInt(String.valueOf(request.getStock())));

        Product updatedProduct = productRepository.save(product);
        return mapToResponseDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));
        productRepository.delete(product);
    }

    private ProductResponseDto mapToResponseDto(Product product) {
        return new ProductResponseDto(
                product.getId(),
                product.getName(),
                product.getCategory() != null ? product.getCategory().getName() : "Uncategorized",
                product.getPrice(),
                product.getImages() != null && !product.getImages().isEmpty() ?
                        product.getImages().get(0).getUrl() : null
        );
    }
}
