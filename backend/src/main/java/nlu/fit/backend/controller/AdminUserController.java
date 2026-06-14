package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.admin.AdminUserResponseDto;
import nlu.fit.backend.dto.admin.UpdateUserStatusRequest;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.User;
import nlu.fit.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<AdminUserResponseDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        
        Page<AdminUserResponseDto> result = users.map(user -> new AdminUserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRoles() != null && !user.getRoles().isEmpty() ? 
                    user.getRoles().get(0).getName() : "CUSTOMER",
                user.getStatus() == 1 ? "ACTIVE" : "DEACTIVATED",
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        ));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponseDto> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + id));
        
        AdminUserResponseDto dto = new AdminUserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRoles() != null && !user.getRoles().isEmpty() ? 
                    user.getRoles().get(0).getName() : "CUSTOMER",
                user.getStatus() == 1 ? "ACTIVE" : "DEACTIVATED",
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
        
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + id));
        
        user.setStatus(request.getStatus());
        userRepository.save(user);
        
        return ResponseEntity.ok("Trạng thái người dùng đã được cập nhật!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + id));
        
        userRepository.delete(user);
        return ResponseEntity.ok("Người dùng đã được xóa thành công!");
    }
}
