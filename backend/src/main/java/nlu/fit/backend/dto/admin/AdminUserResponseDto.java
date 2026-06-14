package nlu.fit.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminUserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private String createdAt;
}
