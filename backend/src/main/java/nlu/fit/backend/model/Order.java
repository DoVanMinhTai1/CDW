package nlu.fit.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "order_code", nullable = false, unique = true, length = 20)
    private String orderCode; // Ví dụ hiển thị trên UI: #ECH-94012

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "sub_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal subTotal; // Tiền hàng trước thuế

    @Column(name = "estimated_tax", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedTax; // Tiền thuế tính toán động

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice; // Tổng tiền cuối cùng phải trả

    @Column(name = "total_tickets", nullable = false)
    private Integer totalTickets;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // CREDIT_CARD hoặc BANK_TRANSFER

    @Column(name = "status", nullable = false, length = 30)
    private String status; // Lưu dạng chuỗi: DELIVERED, PROCESSING, REFUNDED để FE dễ handle màu sắc

    @Column(name = "gift_message", length = 500)
    private String giftMessage; // Lời nhắn quà tặng (Optional ở trang Shopping Bag)

    @Column(name = "shipping_address_dump", nullable = false, length = 500)
    private String shippingAddressDump; // Lưu cứng chuỗi địa chỉ nhận hàng để làm dữ liệu lịch sử đơn

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    // Quan hệ một chiều xuống OrderItem, tự động lưu/xóa cascade khi thay đổi Order
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    // Tự động gán và cập nhật thời gian hệ thống
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}