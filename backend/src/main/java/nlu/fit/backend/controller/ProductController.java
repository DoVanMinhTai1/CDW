package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.product.ProductResponseDto;
import nlu.fit.backend.dto.product.ProductSearchRequest;
import nlu.fit.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductRepository productRepository;

    /**
     * API Lấy danh sách sản phẩm kèm theo toàn bộ filter, phân trang, và sắp xếp.
     * Sử dụng POST để dễ gửi Object Filter phức tạp dưới Body (hoặc chuyển sang GET nếu map QueryParam)
     */
    @PostMapping("/filter")
    public ResponseEntity<Page<ProductResponseDto>> getFilteredProducts(@RequestBody ProductSearchRequest request) {

        // 1. Xử lý Sắp xếp (Sort) dựa vào trường sortBy gửi lên
        Sort sort = Sort.by("id").descending(); // Mặc định nếu không truyền
        if (request.getSortBy() != null) {
            switch (request.getSortBy()) {
                case "price_asc" -> sort = Sort.by("price").ascending();
                case "price_desc" -> sort = Sort.by("price").descending();
                case "newest" -> sort = Sort.by("createdAt").descending();
                case "featured" -> sort = Sort.by("isFeatured").descending(); // Giả định có trường hàng nổi bật
            }
        }

        // 2. Tạo đối tượng Phân trang (Pageable)
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        // 3. Xử lý các mảng rỗng (Tránh lỗi SQL IN trống)
        List<Long> categoryIds = (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) ? request.getCategoryIds() : null;
        List<Long> materialIds = (request.getMaterialIds() != null && !request.getMaterialIds().isEmpty()) ? request.getMaterialIds() : null;
        String search = (request.getSearch() != null && !request.getSearch().trim().isEmpty()) ? request.getSearch().trim() : null;

        // 4. Gọi Repository và trả kết quả bao gồm metadata phân trang (totalPages, totalElements...)
        Page<ProductResponseDto> result = productRepository.filterProducts(
                search,
                categoryIds,
                materialIds,
                request.getMinPrice(),
                request.getMaxPrice(),
                pageable
        );

        return ResponseEntity.ok(result);
    }
}