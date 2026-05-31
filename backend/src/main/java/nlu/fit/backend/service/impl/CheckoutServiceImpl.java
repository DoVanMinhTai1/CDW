package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.checkout.AddressDto;
import nlu.fit.backend.dto.checkout.InitCheckoutRequest;
import nlu.fit.backend.dto.checkout.OrderReviewResponseDto;
import nlu.fit.backend.exception.BadRequestException;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.CartItem;
import nlu.fit.backend.model.User;
import nlu.fit.backend.model.UserAddress;
import nlu.fit.backend.repository.CartItemRepository;
import nlu.fit.backend.repository.UserAddressRepository;
import nlu.fit.backend.repository.UserRepository;
import nlu.fit.backend.service.CheckoutService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final UserAddressRepository userAddressRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Override
    public AddressDto getDefaultAddress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        UserAddress address = userAddressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .orElseGet(() -> {
                    List<UserAddress> list = userAddressRepository.findByUserId(user.getId());
                    return list.isEmpty() ? null : list.get(0);
                });

        if (address == null) {
            AddressDto dto = new AddressDto();
            dto.setFirstName("");
            dto.setLastName("");
            dto.setStreetAddress("");
            dto.setCity("");
            dto.setPostalCode("");
            dto.setCountry("");
            return dto;
        }

        AddressDto dto = new AddressDto();
        dto.setFirstName(address.getFirstName());
        dto.setLastName(address.getLastName());
        dto.setStreetAddress(address.getStreetAddress());
        dto.setCity(address.getCity());
        dto.setPostalCode(address.getPostalCode());
        dto.setCountry(address.getCountry());
        return dto;
    }

    @Override
    public OrderReviewResponseDto calculateOrderSummary(String email, AddressDto address) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        BigDecimal subTotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            subTotal = subTotal.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Tỷ lệ thuế động dựa trên quốc gia
        double taxRate = 0.10; // mặc định 10%
        if (address != null && address.getCountry() != null) {
            String country = address.getCountry().toUpperCase().trim();
            if (country.contains("FRANCE") || country.contains("GERMANY") || country.contains("ITALY") || country.contains("EU")) {
                taxRate = 0.20; // 20% VAT ở châu Âu
            } else if (country.contains("USA") || country.contains("UNITED STATES") || country.contains("US")) {
                taxRate = 0.08; // 8% thuế ở Mỹ
            } else if (country.contains("VIETNAM") || country.contains("VN")) {
                taxRate = 0.10; // 10% VAT ở Việt Nam
            }
        }

        BigDecimal estimatedTax = subTotal.multiply(BigDecimal.valueOf(taxRate));
        BigDecimal shippingCost = BigDecimal.ZERO; // Complimentary shipping
        BigDecimal total = subTotal.add(estimatedTax).add(shippingCost);

        OrderReviewResponseDto summary = new OrderReviewResponseDto();
        summary.setSubTotal(subTotal);
        summary.setShippingMethod("Complimentary");
        summary.setShippingCost(shippingCost);
        summary.setEstimatedTax(estimatedTax);
        summary.setTotal(total);

        return summary;
    }

    @Override
    public String continueToReview(String email, InitCheckoutRequest request) {
        if (request.getShippingAddress() == null) {
            throw new BadRequestException("Địa chỉ vận chuyển không được để trống!");
        }
        
        AddressDto addr = request.getShippingAddress();
        if (addr.getFirstName().isBlank() || addr.getLastName().isBlank() || 
            addr.getStreetAddress().isBlank() || addr.getCity().isBlank() || 
            addr.getCountry().isBlank()) {
            throw new BadRequestException("Vui lòng nhập đầy đủ các thông tin địa chỉ bắt buộc!");
        }

        if (request.getPaymentMethod() == null || 
            (!request.getPaymentMethod().equals("CREDIT_CARD") && !request.getPaymentMethod().equals("BANK_TRANSFER"))) {
            throw new BadRequestException("Phương thức thanh toán không hợp lệ!");
        }

        return "Thông tin vận chuyển và thanh toán hợp lệ. Chuyển sang bước Review.";
    }
}
