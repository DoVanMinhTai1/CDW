package nlu.fit.backend.dto.admin;

import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED
}
