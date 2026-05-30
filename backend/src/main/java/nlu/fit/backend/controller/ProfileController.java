package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.profile.RecentOrderDto;
import nlu.fit.backend.dto.profile.UpdateProfileRequest;
import nlu.fit.backend.dto.profile.UserProfileResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    /**
     * 1. API Lấy thông tin chi tiết Dashboard cá nhân
     * (Để render tên, email, ngày tham gia và bảng lịch sử đơn hàng gần đây)
     */
    @GetMapping
    public ResponseEntity<UserProfileResponseDto> getProfileDashboard(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        String email = authentication.getName();

        // Logic mẫu xử lý:
        // - Tìm thông tin User theo email để lấy fullName, address, createdAt.
        // - Truy vấn bảng Order lấy ra Top 3 đơn hàng mới nhất của User này.

        UserProfileResponseDto dashboard = new UserProfileResponseDto();
        dashboard.setFullName("Julianne V. Sterling");
        dashboard.setEmail(email);
        dashboard.setPrimaryShippingAddress("1428 Fifth Avenue, Suite 402, New York, NY 10019");
        dashboard.setMemberSince("October 2021");

        // Giả lập danh sách đơn hàng đổ về cho bảng "Recent Orders"
        RecentOrderDto order1 = new RecentOrderDto();
        order1.setOrderId("#ECH-94012");
        order1.setOrderDate(LocalDate.of(2024, 1, 14));
        order1.setStatus("Delivered");
        order1.setTotal(new BigDecimal("4850.00"));

        dashboard.setRecentOrders(List.of(order1));

        return ResponseEntity.ok(dashboard);
    }

    /**
     * 2. API Cập nhật thông tin cá nhân (Khi chỉnh sửa Họ tên, Địa chỉ và bấm SAVE PROFILE)
     */
    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();

        // Logic xử lý:
        // - Tìm User trong DB theo email.
        // - set lại dữ liệu: user.setFullName(request.getFullName()), ...
        // - userRepository.save(user);

        return ResponseEntity.ok("Cập nhật thông tin tài khoản thành công!");
    }

    /**
     * 3. API Xem TẤT CẢ các đơn hàng (Khi bấm vào nút "View All Orders" hoặc tab "Order History")
     * Nên thiết kế hỗ trợ phân trang phòng trường hợp khách hàng VIP mua cực kỳ nhiều đồ.
     */
    @GetMapping("/orders")
    public ResponseEntity<List<RecentOrderDto>> getAllOrderHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();

        // Logic: Tìm tất cả bản ghi trong bảng Order thuộc về User này, sắp xếp theo thời gian mới nhất giảm dần.

        return ResponseEntity.ok(List.of()); // Trả về danh sách phân trang
    }
}