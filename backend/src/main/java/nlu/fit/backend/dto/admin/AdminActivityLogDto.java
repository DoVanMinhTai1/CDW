package nlu.fit.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminActivityLogDto {
    private String action;      // Hành động (Ví dụ: "Modified Product 'Rivière Necklace'")
    private String module;      // Phân hệ tác động (Inventory, Finance, Permissions)
    private LocalDateTime dateTime; // Thời gian thực hiện
    private String status;
}
