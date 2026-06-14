package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.admin.AdminOrderResponseDto;
import nlu.fit.backend.dto.admin.UpdateOrderStatusRequest;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.Order;
import nlu.fit.backend.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminOrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<Page<AdminOrderResponseDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orders;
        
        if (status != null && !status.isEmpty()) {
            orders = orderRepository.findByStatus(status, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }
        
        Page<AdminOrderResponseDto> result = orders.map(order -> new AdminOrderResponseDto(
                order.getId(),
                order.getOrderCode(),
                order.getUser() != null ? order.getUser().getFullName() : "Unknown",
                order.getUserEmail(),
                order.getTotalPrice() != null ? order.getTotalPrice().toString() : "0",
                order.getStatus(),
                order.getCreatedAt() != null ? order.getCreatedAt().toString() : ""
        ));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + id));
        
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable String id,
            @RequestBody UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + id));
        
        order.setStatus(request.getStatus());
        orderRepository.save(order);
        
        return ResponseEntity.ok("Trạng thái đơn hàng đã được cập nhật!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + id));
        
        orderRepository.delete(order);
        return ResponseEntity.ok("Đơn hàng đã được xóa thành công!");
    }
}
