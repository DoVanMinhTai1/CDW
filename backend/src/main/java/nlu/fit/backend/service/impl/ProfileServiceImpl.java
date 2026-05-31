package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.profile.RecentOrderDto;
import nlu.fit.backend.dto.profile.UpdateProfileRequest;
import nlu.fit.backend.dto.profile.UserProfileResponseDto;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.Order;
import nlu.fit.backend.model.User;
import nlu.fit.backend.model.UserAddress;
import nlu.fit.backend.repository.OrderRepository;
import nlu.fit.backend.repository.UserAddressRepository;
import nlu.fit.backend.repository.UserRepository;
import nlu.fit.backend.service.ProfileService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final UserAddressRepository userAddressRepository;

    @Override
    public UserProfileResponseDto getProfileDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        UserProfileResponseDto dashboard = new UserProfileResponseDto();
        dashboard.setFullName(user.getFullName() != null ? user.getFullName() : "User");
        dashboard.setEmail(user.getEmail());

        // Lấy địa chỉ chính
        List<UserAddress> addresses = userAddressRepository.findByUserId(user.getId());
        UserAddress primaryAddr = addresses.stream()
                .filter(UserAddress::isDefault)
                .findFirst()
                .orElse(addresses.isEmpty() ? null : addresses.get(0));

        if (primaryAddr != null) {
            String fullAddr = String.format("%s, %s, %s",
                    primaryAddr.getStreetAddress(), primaryAddr.getCity(), primaryAddr.getCountry());
            dashboard.setPrimaryShippingAddress(fullAddr);
        } else {
            dashboard.setPrimaryShippingAddress("Chưa thiết lập địa chỉ nhận hàng");
        }

        // Định dạng thời gian tham gia
        Instant joinDate = user.getCreatedAt() != null ? user.getCreatedAt() : Instant.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH);
        dashboard.setMemberSince(formatter.format(joinDate.atZone(ZoneId.systemDefault())));

        // Lấy 3 đơn hàng gần nhất
        List<Order> recentOrders = orderRepository.findTop3ByUserIdOrderByCreatedAtDesc(user.getId());
        List<RecentOrderDto> orderDtos = new ArrayList<>();
        for (Order o : recentOrders) {
            orderDtos.add(mapToRecentOrderDto(o));
        }
        dashboard.setRecentOrders(orderDtos);

        return dashboard;
    }

    @Override
    @Transactional
    public void updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // Cập nhật hoặc thêm địa chỉ nhận hàng chính
        if (request.getPrimaryShippingAddress() != null && !request.getPrimaryShippingAddress().isBlank()) {
            String fullAddr = request.getPrimaryShippingAddress().trim();
            String street = fullAddr;
            String city = "Default City";
            String country = "Vietnam";

            // Thử phân tách chuỗi địa chỉ
            String[] parts = fullAddr.split(",");
            if (parts.length >= 3) {
                street = parts[0].trim();
                city = parts[1].trim();
                country = parts[parts.length - 1].trim();
            } else if (parts.length == 2) {
                street = parts[0].trim();
                city = parts[1].trim();
            }

            List<UserAddress> addresses = userAddressRepository.findByUserId(user.getId());
            UserAddress defaultAddr = addresses.stream()
                    .filter(UserAddress::isDefault)
                    .findFirst()
                    .orElse(addresses.isEmpty() ? null : addresses.get(0));

            if (defaultAddr == null) {
                defaultAddr = new UserAddress();
                defaultAddr.setUser(user);
                defaultAddr.setFirstName(user.getFullName() != null ? user.getFullName().split(" ")[0] : "First");
                defaultAddr.setLastName(user.getFullName() != null && user.getFullName().contains(" ") 
                        ? user.getFullName().substring(user.getFullName().indexOf(" ") + 1) : "Last");
                defaultAddr.setDefault(true);
            }

            defaultAddr.setStreetAddress(street);
            defaultAddr.setCity(city);
            defaultAddr.setCountry(country);
            userAddressRepository.save(defaultAddr);
        }
    }

    @Override
    public List<RecentOrderDto> getAllOrderHistory(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        Pageable pageable = PageRequest.of(page, size);
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable).getContent();

        List<RecentOrderDto> dtoList = new ArrayList<>();
        for (Order o : orders) {
            dtoList.add(mapToRecentOrderDto(o));
        }
        return dtoList;
    }

    private RecentOrderDto mapToRecentOrderDto(Order order) {
        RecentOrderDto dto = new RecentOrderDto();
        dto.setOrderId(order.getOrderCode());
        
        LocalDate date = order.getCreatedAt() != null 
                ? LocalDate.ofInstant(order.getCreatedAt(), ZoneId.systemDefault()) 
                : LocalDate.now();
        dto.setOrderDate(date);
        
        // Định dạng trạng thái chữ hoa chữ thường
        String status = order.getStatus();
        if ("DELIVERED".equals(status)) {
            dto.setStatus("Delivered");
        } else if ("PROCESSING".equals(status)) {
            dto.setStatus("Processing");
        } else if ("REFUNDED".equals(status)) {
            dto.setStatus("Refunded");
        } else {
            dto.setStatus(status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase());
        }
        
        dto.setTotal(order.getTotalPrice());
        return dto;
    }
}
