package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.admin.AdminActivityLogDto;
import nlu.fit.backend.dto.admin.AdminProfileResponseDto;
import nlu.fit.backend.dto.admin.UpdateAdminProfileRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    /**
     * 1. API Lấy toàn bộ thông tin cấu hình và nhật ký hoạt động của Admin
     * Sử dụng khi vừa load vào trang quản trị cá nhân
     */
    @GetMapping
    public ResponseEntity<AdminProfileResponseDto> getAdminDashboard(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        String email = authentication.getName();

        // Logic thực tế:
        // - Truy vấn thông tin tài khoản Admin dựa vào email.
        // - Đọc dữ liệu từ bảng SystemActivityLog lấy ra 3 hành động gần nhất của chính admin này.

        AdminProfileResponseDto dto = new AdminProfileResponseDto();
        dto.setFullName("Julian Rossi");
        dto.setEmail(email);
        dto.setMobileNumber("+33 6 12 34 56 78");
        dto.setRole("SUPER ADMINISTRATOR");
        dto.setMemberSince("SINCE OCT 2021");
        dto.setLanguage("English (UK)");
        dto.setNotificationsActive(true);
        dto.setCurrency("EUR (€)");
        dto.setTwoFactorAuthEnabled(true);
        dto.setActiveDevices(List.of("MacBook Pro M2 - Paris, FR (Current)"));

        // Giả lập bảng dữ liệu log đúng theo UI
        AdminActivityLogDto log1 = new AdminActivityLogDto();
        log1.setAction("Modified Product 'Rivière Necklace'");
        log1.setModule("Inventory");
        log1.setDateTime(LocalDateTime.of(2023, 10, 24, 14, 22));
        log1.setStatus("SUCCESS");

        dto.setRecentActivities(List.of(log1));

        return ResponseEntity.ok(dto);
    }

    /**
     * 2. API Lưu cập nhật Thông tin & Cấu hình tùy chọn hệ thống (Khi bấm SAVE CHANGES)
     */
    @PutMapping("/update")
    public ResponseEntity<String> updateAdminProfile(
            @RequestBody UpdateAdminProfileRequest request,
            Authentication authentication) {

        // Logic thực tế:
        // - Lấy đối tượng Admin hiện tại -> Cập nhật các trường thông tin cơ bản
        // - Cập nhật luôn cấu hình Preferences (Ngôn ngữ, Tiền tệ) vào cấu hình tài khoản

        return ResponseEntity.ok("Cấu hình tài khoản quản trị đã được cập nhật thành công!");
    }

    /**
     * 3. API Thay đổi ảnh đại diện (Avatar) của Admin
     * Xử lý khi Admin nhấn vào biểu tượng chiếc bút chì đè trên ảnh đại diện hình vuông
     */
    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") Object file, Authentication authentication) {
        // Logic thực tế: Sử dụng MultipartFile để tiếp nhận file ảnh từ FE gửi lên -> Đẩy lên Cloudinary / S3 -> Cập nhật link ảnh vào trường avatarUrl của Admin trong DB.
        return ResponseEntity.ok("https://cdn.leclat.com/avatars/admin_julian.jpg");
    }

    /**
     * 4. API Xem toàn bộ danh sách lịch sử hoạt động hệ thống (Khi bấm nút "VIEW ALERT LOG")
     */
    @GetMapping("/activity-logs")
    public ResponseEntity<List<AdminActivityLogDto>> getAllSystemLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        // Logic thực tế: Truy vấn bảng log hệ thống, sắp xếp theo thời gian mới nhất (Phục vụ mục đích audit hệ thống)
        return ResponseEntity.ok(List.of());
    }
}