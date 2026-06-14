package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.cart.AddToCartRequest;
import nlu.fit.backend.dto.wishlist.MoveToCartRequest;
import nlu.fit.backend.dto.wishlist.WishlistItemResponseDto;
import nlu.fit.backend.exception.BadRequestException;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.Product;
import nlu.fit.backend.model.ProductImage;
import nlu.fit.backend.model.User;
import nlu.fit.backend.model.Wishlist;
import nlu.fit.backend.repository.ProductRepository;
import nlu.fit.backend.repository.UserRepository;
import nlu.fit.backend.repository.WishlistRepository;
import nlu.fit.backend.service.CartService;
import nlu.fit.backend.service.WishlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Override
    public List<WishlistItemResponseDto> getMyWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        List<Wishlist> wishlists = wishlistRepository.findByUserId(user.getId());
        List<WishlistItemResponseDto> dtoList = new ArrayList<>();
        
        for (Wishlist w : wishlists) {
            Product p = w.getProduct();
            WishlistItemResponseDto dto = new WishlistItemResponseDto();
            dto.setWishlistId(w.getId());
            dto.setProductId(p.getId());
            dto.setProductName(p.getName());
            
            // Chất liệu/Thông số: lấy từ Material
            String matName = p.getMaterial() != null ? p.getMaterial().getName() : "Premium Metal";
            dto.setAttributes(matName + " • Jewelry");
            dto.setPrice(p.getPrice());
            
            // Tìm ảnh chính
            String thumb = "";
            if (p.getImages() != null && !p.getImages().isEmpty()) {
                thumb = p.getImages().stream()
                        .filter(ProductImage::getIsPrimary)
                        .map(ProductImage::getUrl)
                        .findFirst()
                        .orElse(p.getImages().get(0).getUrl());
            }
            dto.setThumbnailUrl(thumb);
            
            dtoList.add(dto);
        }
        
        return dtoList;
    }

    @Override
    @Transactional
    public void addToWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + productId));
        
        if (wishlistRepository.findByUserIdAndProductId(user.getId(), product.getId()).isPresent()) {
            throw new BadRequestException("Sản phẩm đã nằm trong danh sách yêu thích!");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlist.setAddedAt(LocalDateTime.now());
        
        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long wishlistId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mục yêu thích với id: " + wishlistId));

        if (!wishlist.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Mục yêu thích này không thuộc về bạn");
        }

        wishlistRepository.delete(wishlist);
    }

    @Override
    @Transactional
    public void moveToCart(String email, MoveToCartRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        
        // 1. Thêm vào giỏ hàng (Số lượng mặc định là 1)
        AddToCartRequest addRequest = new AddToCartRequest();
        addRequest.setProductId(request.getProductId());
        addRequest.setSize(request.getSize() != null ? request.getSize() : 6); // size mặc định là 6
        addRequest.setQuantity(1);
        
        cartService.addItemToCart(email, addRequest);
        
        // 2. Xóa khỏi danh sách yêu thích
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), request.getProductId());
    }
}
