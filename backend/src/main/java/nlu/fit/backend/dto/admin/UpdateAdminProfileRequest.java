package nlu.fit.backend.dto.admin;

import lombok.Data;

@Data
public class UpdateAdminProfileRequest {
    private String fullName;
    private String mobileNumber;
    private String language;
    private boolean notificationsActive;
    private String currency;
}