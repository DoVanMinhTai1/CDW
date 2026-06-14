package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.category.CategoryResponseDto;
import nlu.fit.backend.dto.category.CreateCategoryRequest;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.Category;
import nlu.fit.backend.model.Material;
import nlu.fit.backend.repository.CategoryRepository;
import nlu.fit.backend.repository.MaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final MaterialRepository materialRepository;

    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {
        List<CategoryResponseDto> categories = categoryRepository.findAll().stream()
                .map(cat -> new CategoryResponseDto(
                        cat.getId(),
                        cat.getName(),
                        cat.getDescription(),
                        (long) (cat.getProducts() != null ? cat.getProducts().size() : 0)
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id));
        
        CategoryResponseDto dto = new CategoryResponseDto(
                category.getId(),
                category.getName(),
                category.getDescription(),
                (long) (category.getProducts() != null ? category.getProducts().size() : 0)
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(@RequestBody CreateCategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        Category savedCategory = categoryRepository.save(category);
        CategoryResponseDto dto = new CategoryResponseDto(
                savedCategory.getId(),
                savedCategory.getName(),
                savedCategory.getDescription(),
                0L
        );
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> updateCategory(
            @PathVariable Long id,
            @RequestBody CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id));
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        Category updatedCategory = categoryRepository.save(category);
        CategoryResponseDto dto = new CategoryResponseDto(
                updatedCategory.getId(),
                updatedCategory.getName(),
                updatedCategory.getDescription(),
                (long) (updatedCategory.getProducts() != null ? updatedCategory.getProducts().size() : 0)
        );
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id));
        
        categoryRepository.delete(category);
        return ResponseEntity.ok("Danh mục đã được xóa thành công!");
    }

    @GetMapping("/materials")
    public ResponseEntity<List<Material>> getAllMaterials() {
        return ResponseEntity.ok(materialRepository.findAll());
    }
}