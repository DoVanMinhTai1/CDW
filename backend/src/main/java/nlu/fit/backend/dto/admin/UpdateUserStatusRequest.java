package nlu.fit.backend.dto.admin;

import lombok.Data;

@Data
public class UpdateUserStatusRequest {
    private Byte status; // 1 = active, 0 = deactivated
}
