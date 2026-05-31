package nlu.fit.backend.repository;

import nlu.fit.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    
    Optional<CartItem> findByUserIdAndProductIdAndSize(Long userId, Long productId, Integer size);
    
    void deleteByUserId(Long userId);
}
