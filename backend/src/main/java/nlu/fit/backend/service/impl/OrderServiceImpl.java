package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.checkout.AddressDto;
import nlu.fit.backend.dto.checkout.InitCheckoutRequest;
import nlu.fit.backend.dto.order.OrderHistoryResponseDto;
import nlu.fit.backend.exception.BadRequestException;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.*;
import nlu.fit.backend.repository.*;
import nlu.fit.backend.service.CartService;
import nlu.fit.backend.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Override
    @Transactional
    public Order createOrder(String email, InitCheckoutRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Giỏ hàng của bạn đang trống, không thể tạo đơn hàng!");
        }

        // 1. Tính toán giá trị đơn hàng
        BigDecimal subTotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            BigDecimal itemCost = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subTotal = subTotal.add(itemCost);
            
            // Kiểm tra số lượng tồn kho
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new BadRequestException("Sản phẩm " + item.getProduct().getName() + " không đủ tồn kho!");
            }
        }

        // Tính thuế mặc định 10%
        BigDecimal estimatedTax = subTotal.multiply(new BigDecimal("0.10"));
        BigDecimal totalPrice = subTotal.add(estimatedTax);

        // 2. Tạo đối tượng Order
        Order order = new Order();
        order.setUser(user);
        order.setSubTotal(subTotal);
        order.setEstimatedTax(estimatedTax);
        order.setTotalPrice(totalPrice);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD");
        order.setStatus("PROCESSING");
        
        // Sinh mã đơn hàng ngẫu nhiên, ví dụ: #ECH-94012
        int randomCode = 10000 + new Random().nextInt(90000);
        order.setOrderCode("#ECH-" + randomCode);

        // Format địa chỉ nhận hàng
        AddressDto address = request.getShippingAddress();
        if (address != null) {
            String addressStr = String.format("%s %s, %s, %s, %s, %s",
                    address.getFirstName(), address.getLastName(),
                    address.getStreetAddress(), address.getCity(),
                    address.getPostalCode() != null ? address.getPostalCode() : "",
                    address.getCountry());
            order.setShippingAddressDump(addressStr);
        } else {
            order.setShippingAddressDump("Default Shipping Address");
        }

        // Lưu Order để sinh ID UUID
        order = orderRepository.save(order);

        // 3. Tạo các OrderItem và giảm tồn kho
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setPrice(cartItem.getPrice());
            orderItemRepository.save(orderItem);
            orderItems.add(orderItem);

            // Cập nhật số lượng tồn kho sản phẩm
            Product prod = cartItem.getProduct();
            prod.setStock(prod.getStock() - cartItem.getQuantity());
            productRepository.save(prod);
        }
        order.setOrderItems(orderItems);

        // 4. Xóa giỏ hàng của người dùng
        cartService.clearCart(user.getId());

        return order;
    }

    @Override
    public Page<OrderHistoryResponseDto> getOrderHistory(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        return orders.map(order -> {
            OrderHistoryResponseDto dto = new OrderHistoryResponseDto();
            dto.setId(order.getId());
            dto.setOrderId(order.getOrderCode());
            
            LocalDate date = order.getCreatedAt() != null 
                    ? LocalDate.ofInstant(order.getCreatedAt(), ZoneId.systemDefault()) 
                    : LocalDate.now();
            dto.setOrderDate(date);
            
            // Việt hóa trạng thái
            switch (order.getStatus()) {
                case "DELIVERED" -> dto.setStatus("ĐÃ GIAO");
                case "PROCESSING" -> dto.setStatus("ĐANG XỬ LÝ");
                case "REFUNDED" -> dto.setStatus("ĐÃ HOÀN TRẢ");
                default -> dto.setStatus(order.getStatus());
            }
            
            dto.setStatusCode(order.getStatus());
            dto.setTotal(order.getTotalPrice());

            // Icon lấy ảnh của sản phẩm đầu tiên trong đơn
            if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                Product p = order.getOrderItems().get(0).getProduct();
                if (p.getImages() != null && !p.getImages().isEmpty()) {
                    dto.setPreviewIcon(p.getImages().get(0).getUrl());
                }
            }

            return dto;
        });
    }

    @Override
    public Order getOrderDetail(String id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với id: " + id));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Đơn hàng này không thuộc về bạn");
        }

        return order;
    }

    @Override
    public List<Order> getRecentOrders(String email, int limit) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        return orderRepository.findTop3ByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
