package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.cart.AddToCartRequest;
import nlu.fit.backend.dto.cart.CartItemResponseDto;
import nlu.fit.backend.dto.cart.CartSummaryResponseDto;
import nlu.fit.backend.exception.BadRequestException;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.CartItem;
import nlu.fit.backend.model.Product;
import nlu.fit.backend.model.ProductImage;
import nlu.fit.backend.model.User;
import nlu.fit.backend.repository.CartItemRepository;
import nlu.fit.backend.repository.ProductRepository;
import nlu.fit.backend.repository.UserRepository;
import nlu.fit.backend.service.CartService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartSummaryResponseDto getCartSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        return calculateSummary(items, null);
    }

    @Override
    @Transactional
    public CartSummaryResponseDto addItemToCart(String email, AddToCartRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + request.getProductId()));
        
        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Số lượng sản phẩm thêm vào giỏ hàng phải lớn hơn 0");
        }

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Số lượng tồn kho không đủ (Hiện có: " + product.getStock() + ")");
        }

        CartItem cartItem = cartItemRepository.findByUserIdAndProductIdAndSize(user.getId(), product.getId(), request.getSize())
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setUser(user);
                    item.setProduct(product);
                    item.setSize(request.getSize());
                    item.setQuantity(0);
                    item.setPrice(product.getPrice());
                    return item;
                });

        int newQuantity = cartItem.getQuantity() + request.getQuantity();
        if (product.getStock() < newQuantity) {
            throw new BadRequestException("Tổng số lượng trong giỏ (" + newQuantity + ") vượt quá số lượng tồn kho (" + product.getStock() + ")");
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        return getCartSummary(email);
    }

    @Override
    @Transactional
    public CartSummaryResponseDto updateItemQuantity(Long cartItemId, int quantity, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dòng giỏ hàng với id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Dòng giỏ hàng này không thuộc về bạn");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            if (cartItem.getProduct().getStock() < quantity) {
                throw new BadRequestException("Số lượng tồn kho không đủ (Hiện có: " + cartItem.getProduct().getStock() + ")");
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return getCartSummary(email);
    }

    @Override
    @Transactional
    public CartSummaryResponseDto removeItem(Long cartItemId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dòng giỏ hàng với id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Dòng giỏ hàng này không thuộc về bạn");
        }

        cartItemRepository.delete(cartItem);
        return getCartSummary(email);
    }

    @Override
    public CartSummaryResponseDto applyPromoCode(String promoCode, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        
        if (!"WELCOME10".equalsIgnoreCase(promoCode) && !"JEWELRY20".equalsIgnoreCase(promoCode)) {
            throw new BadRequestException("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
        }

        return calculateSummary(items, promoCode.toUpperCase());
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    @Transactional
    public void clearCartByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        cartItemRepository.deleteByUserId(user.getId());
    }

    private CartSummaryResponseDto calculateSummary(List<CartItem> items, String promoCode) {
        CartSummaryResponseDto summary = new CartSummaryResponseDto();
        List<CartItemResponseDto> dtoList = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;

        for (CartItem item : items) {
            CartItemResponseDto dto = new CartItemResponseDto();
            dto.setCartItemId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setAttributes("Size: " + item.getSize());
            
            // Tìm ảnh chính
            String thumb = "";
            if (item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
                thumb = item.getProduct().getImages().stream()
                        .filter(ProductImage::getIsPrimary)
                        .map(ProductImage::getUrl)
                        .findFirst()
                        .orElse(item.getProduct().getImages().get(0).getUrl());
            }
            dto.setThumbnailUrl(thumb);
            dto.setQuantity(item.getQuantity());
            dto.setPrice(item.getPrice());
            
            BigDecimal itemSubTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            dto.setSubTotal(itemSubTotal);
            subTotal = subTotal.add(itemSubTotal);
            
            dtoList.add(dto);
        }

        summary.setItems(dtoList);
        summary.setSubTotal(subTotal);
        summary.setShippingMethod("COMPLIMENTARY");
        summary.setShippingCost(BigDecimal.ZERO);

        BigDecimal discount = BigDecimal.ZERO;
        if (promoCode != null) {
            summary.setAppliedPromoCode(promoCode);
            if ("WELCOME10".equals(promoCode)) {
                discount = subTotal.multiply(new BigDecimal("0.10"));
            } else if ("JEWELRY20".equals(promoCode)) {
                discount = subTotal.multiply(new BigDecimal("0.20"));
            }
        }
        summary.setDiscountAmount(discount);
        summary.setEstimatedTotal(subTotal.subtract(discount));

        return summary;
    }

    public Integer getCartCount(User user) {
        if (user == null) return 0;
        return cartItemRepository.countTotalQuantityByUserId(user.getId());
    }
}
