package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.admin.AdminActivityLogDto;
import nlu.fit.backend.dto.admin.AdminProfileResponseDto;
import nlu.fit.backend.dto.admin.UpdateAdminProfileRequest;
import nlu.fit.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<AdminProfileResponseDto> getAdminDashboard(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(adminService.getAdminDashboard(email));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateAdminProfile(
            @RequestBody UpdateAdminProfileRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        adminService.updateAdminProfile(email, request);
        return ResponseEntity.ok("Cấu hình tài khoản quản trị đã được cập nhật thành công!");
    }

    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") Object file, Authentication authentication) {
        // Upload avatar placeholder
        return ResponseEntity.ok("https://cdn.leclat.com/avatars/admin_julian.jpg");
    }

    @GetMapping("/activity-logs")
    public ResponseEntity<List<AdminActivityLogDto>> getAllSystemLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAllActivityLogs(page, size));
    }
}