package nlu.fit.backend.dto.order;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OrderHistoryResponseDto {
    private String id;            // ID thực tế dạng UUID phục vụ nút "CHI TIẾT"
    private String orderId;       // Mã đơn dạng chuỗi (Ví dụ: #ECH-94012)
    private LocalDate orderDate;  // Ngày đặt (12.10.2023)
    private String status;        // Trạng thái: "ĐÃ GIAO", "ĐANG XỬ LÝ", "ĐÃ HOÀN TRẢ"
    private String statusCode;    // Code phục vụ FE render màu css (DELIVERED, PROCESSING, REFUNDED)
    private BigDecimal total;     // Tổng tiền đơn hàng (145.000.000đ)
    private String previewIcon;   // Loại icon hiển thị bên trái tương ứng trạng thái/bộ sưu tập (nếu có)
}