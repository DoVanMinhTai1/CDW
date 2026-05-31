package nlu.fit.backend.controller;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.profile.RecentOrderDto;
import nlu.fit.backend.dto.profile.UpdateProfileRequest;
import nlu.fit.backend.dto.profile.UserProfileResponseDto;
import nlu.fit.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserProfileResponseDto> getProfileDashboard(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getProfileDashboard(email));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        profileService.updateProfile(email, request);
        return ResponseEntity.ok("Cập nhật thông tin tài khoản thành công!");
    }

    @GetMapping("/orders")
    public ResponseEntity<List<RecentOrderDto>> getAllOrderHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getAllOrderHistory(email, page, size));
    }
}