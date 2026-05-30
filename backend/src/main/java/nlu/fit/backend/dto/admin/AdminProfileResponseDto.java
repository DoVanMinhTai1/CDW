package nlu.fit.backend.dto.admin;

import java.util.List;

public class AdminProfileResponseDto {
    private String fullName;
    private String email;
    private String mobileNumber;
    private String role;              // "SUPER ADMINISTRATOR"
    private String avatarUrl;
    private String memberSince;       // "SINCE OCT 2021"

    // Preferences
    private String language;          // "en" hoặc "vi"
    private boolean notificationsActive;
    private String currency;          // "EUR" hoặc "VND"

    // Security
    private boolean twoFactorAuthEnabled;
    private List<String> activeDevices; // Danh sách thiết bị ("MacBook Pro M2 - Paris, FR")

    // Nhật ký
    private List<AdminActivityLogDto> recentActivities;
}
