package nlu.fit.backend.repository;

import nlu.fit.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Order> findTop3ByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Order> findByStatus(String status, Pageable pageable);
}
