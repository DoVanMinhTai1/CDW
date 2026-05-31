package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.order.OrderHistoryResponseDto;
import nlu.fit.backend.model.Order;
import nlu.fit.backend.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/history")
    public ResponseEntity<Page<OrderHistoryResponseDto>> getOrderHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String userEmail = authentication.getName();
        Page<OrderHistoryResponseDto> resultPage = orderService.getOrderHistory(userEmail, page, size);
        return ResponseEntity.ok(resultPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderDetail(@PathVariable String id, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String userEmail = authentication.getName();
        Order order = orderService.getOrderDetail(id, userEmail);
        return ResponseEntity.ok(order);
    }
}