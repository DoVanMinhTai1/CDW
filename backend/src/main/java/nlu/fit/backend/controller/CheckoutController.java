package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.checkout.AddressDto;
import nlu.fit.backend.dto.checkout.InitCheckoutRequest;
import nlu.fit.backend.dto.checkout.OrderReviewResponseDto;
import nlu.fit.backend.model.Order;
import nlu.fit.backend.service.CheckoutService;
import nlu.fit.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;

    @GetMapping("/default-address")
    public ResponseEntity<AddressDto> getDefaultAddress(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(checkoutService.getDefaultAddress(email));
    }

    @PostMapping("/calculate-summary")
    public ResponseEntity<OrderReviewResponseDto> calculateOrderSummary(
            @RequestBody AddressDto shippingAddress,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(checkoutService.calculateOrderSummary(email, shippingAddress));
    }

    @PostMapping("/continue")
    public ResponseEntity<String> continueToReview(
            @RequestBody InitCheckoutRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Yêu cầu xác thực tài khoản");
        String email = authentication.getName();
        return ResponseEntity.ok(checkoutService.continueToReview(email, request));
    }

    @PostMapping("/submit")
    public ResponseEntity<Order> submitOrder(
            @RequestBody InitCheckoutRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        Order order = orderService.createOrder(email, request);
        return ResponseEntity.ok(order);
    }
}