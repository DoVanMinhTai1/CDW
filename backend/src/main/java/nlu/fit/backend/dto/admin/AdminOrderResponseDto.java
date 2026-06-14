package nlu.fit.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminOrderResponseDto {
    private String id;
    private String orderCode;
    private String customerName;
    private String customerEmail;
    private String totalPrice;
    private String status;
    private String createdAt;
}
