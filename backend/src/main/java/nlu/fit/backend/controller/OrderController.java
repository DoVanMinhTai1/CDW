package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.order.OrderHistoryResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    /**
     * 1. API Lấy danh sách lịch sử đơn hàng (Có phân trang)
     * Đổ dữ liệu cho toàn bộ danh sách đơn hàng của người dùng đang đăng nhập
     */
    @GetMapping("/history")
    public ResponseEntity<Page<OrderHistoryResponseDto>> getOrderHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size, // Màn hình đang hiển thị tối đa 4 dòng một trang
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String userEmail = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);

        // --- Logic xử lý thực tế với DB của bạn sẽ như sau: ---
        // Page<Order> ordersPage = orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail, pageable);
        // Sau đó map từ Entity Order sang OrderHistoryResponseDto.

        // Đoạn code giả lập dữ liệu khớp 100% với UI bạn gửi để test FE:
        List<OrderHistoryResponseDto> mockList = new ArrayList<>();

        OrderHistoryResponseDto order1 = new OrderHistoryResponseDto();
        order1.setId(1L);
        order1.setOrderId("#ECH-94012");
        order1.setOrderDate(LocalDate.of(2023, 10, 12));
        order1.setStatus("ĐÃ GIAO");
        order1.setStatusCode("DELIVERED");
        order1.setTotal(new BigDecimal("145000000"));
        mockList.add(order1);

        OrderHistoryResponseDto order2 = new OrderHistoryResponseDto();
        order2.setId(2L);
        order2.setOrderId("#ECH-93881");
        order2.setOrderDate(LocalDate.of(2023, 9, 5));
        order2.setStatus("ĐANG XỬ LÝ");
        order2.setStatusCode("PROCESSING");
        order2.setTotal(new BigDecimal("82400000"));
        mockList.add(order2);

        // Đóng gói danh sách vào đối tượng Page của Spring Data để FE làm thanh phân trang (01, 02, Sau ->)
        Page<OrderHistoryResponseDto> resultPage = new PageImpl<>(mockList, pageable, 4); // Tổng số phần tử tạm tính là 4

        return ResponseEntity.ok(resultPage);
    }

    /**
     * 2. API Xem chi tiết một đơn hàng cụ thể
     * Kích hoạt khi khách hàng bấm trực tiếp vào chữ "CHI TIẾT" ở cuối mỗi dòng đơn hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();

        // Logic: Lấy chi tiết thông tin hóa đơn, danh sách sản phẩm đã mua, địa chỉ nhận hàng của đơn hàng này...

        return ResponseEntity.ok("Trả về object chi tiết hóa đơn của đơn hàng mang ID: " + id);
    }
}