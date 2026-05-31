package nlu.fit.backend.service;

import nlu.fit.backend.dto.admin.AdminActivityLogDto;
import nlu.fit.backend.dto.admin.AdminProfileResponseDto;
import nlu.fit.backend.dto.admin.UpdateAdminProfileRequest;

import java.util.List;

public interface AdminService {
    AdminProfileResponseDto getAdminDashboard(String email);
    
    void updateAdminProfile(String email, UpdateAdminProfileRequest request);
    
    List<AdminActivityLogDto> getAllActivityLogs(int page, int size);
}
