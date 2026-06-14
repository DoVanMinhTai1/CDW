package nlu.fit.backend.service;

import nlu.fit.backend.dto.profile.RecentOrderDto;
import nlu.fit.backend.dto.profile.UpdateProfileRequest;
import nlu.fit.backend.dto.profile.UserProfileResponseDto;

import java.util.List;

public interface ProfileService {
    UserProfileResponseDto getProfileDashboard(String email);
    
    void updateProfile(String email, UpdateProfileRequest request);
    
    List<RecentOrderDto> getAllOrderHistory(String email, int page, int size);
}
