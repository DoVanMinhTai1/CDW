package nlu.fit.backend.service;

import nlu.fit.backend.dto.checkout.InitCheckoutRequest;
import nlu.fit.backend.dto.order.OrderHistoryResponseDto;
import nlu.fit.backend.model.Order;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    Order createOrder(String email, InitCheckoutRequest request);
    
    Page<OrderHistoryResponseDto> getOrderHistory(String email, int page, int size);
    
    Order getOrderDetail(String id, String email);
    
    List<Order> getRecentOrders(String email, int limit);
}
