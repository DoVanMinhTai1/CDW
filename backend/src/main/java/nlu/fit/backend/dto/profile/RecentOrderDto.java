package nlu.fit.backend.dto.profile;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RecentOrderDto {
    private String orderId;       // Mã đơn hàng dạng chuỗi hiển thị (Ví dụ: #ECH-94012)
    private LocalDate orderDate;  // Ngày đặt hàng (Jan 14, 2024)
    private String status;        // Trạng thái đơn: "Delivered", "Processing", "Returned"...
    private BigDecimal total;     // Tổng tiền của đơn hàng đó
}