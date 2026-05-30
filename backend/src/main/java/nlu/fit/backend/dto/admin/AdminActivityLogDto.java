package nlu.fit.backend.dto.admin;

import java.time.LocalDateTime;

public class AdminActivityLogDto {
    private String action;      // Hành động (Ví dụ: "Modified Product 'Rivière Necklace'")
    private String module;      // Phân hệ tác động (Inventory, Finance, Permissions)
    private LocalDateTime dateTime; // Thời gian thực hiện
    private String status;
}
