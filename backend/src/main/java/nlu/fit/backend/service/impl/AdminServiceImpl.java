package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.admin.AdminActivityLogDto;
import nlu.fit.backend.dto.admin.AdminProfileResponseDto;
import nlu.fit.backend.dto.admin.UpdateAdminProfileRequest;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.User;
import nlu.fit.backend.repository.UserRepository;
import nlu.fit.backend.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    public AdminProfileResponseDto getAdminDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Admin với email: " + email));

        AdminProfileResponseDto dto = new AdminProfileResponseDto();
        dto.setFullName(user.getFullName() != null ? user.getFullName() : "Admin");
        dto.setEmail(user.getEmail());
        dto.setMobileNumber(user.getPhone() != null ? user.getPhone() : "+33 6 12 34 56 78");
        dto.setRole("SUPER ADMINISTRATOR");
        dto.setAvatarUrl(user.getAvatarUrl() != null ? user.getAvatarUrl() : "https://cdn.leclat.com/avatars/admin_julian.jpg");
        
        Instant joinDate = user.getCreatedAt() != null ? user.getCreatedAt() : Instant.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);
        dto.setMemberSince("SINCE " + formatter.format(joinDate.atZone(ZoneId.systemDefault())).toUpperCase());

        // Preferences (mặc định)
        dto.setLanguage("English (UK)");
        dto.setNotificationsActive(true);
        dto.setCurrency("EUR (€)");

        // Security
        dto.setTwoFactorAuthEnabled(true);
        dto.setActiveDevices(List.of("MacBook Pro M2 - Paris, FR (Current)"));

        // Giả lập nhật ký hoạt động thực tế để render đẹp mắt
        List<AdminActivityLogDto> logs = new ArrayList<>();
        
        AdminActivityLogDto log1 = new AdminActivityLogDto();
        log1.setAction("Modified Product 'Rivière Necklace'");
        log1.setModule("Inventory");
        log1.setDateTime(LocalDateTime.now().minusHours(2));
        log1.setStatus("SUCCESS");
        logs.add(log1);

        AdminActivityLogDto log2 = new AdminActivityLogDto();
        log2.setAction("Updated shipping policy VAT settings");
        log2.setModule("Finance");
        log2.setDateTime(LocalDateTime.now().minusDays(1));
        log2.setStatus("SUCCESS");
        logs.add(log2);

        dto.setRecentActivities(logs);

        return dto;
    }

    @Override
    @Transactional
    public void updateAdminProfile(String email, UpdateAdminProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Admin với email: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getMobileNumber() != null && !request.getMobileNumber().isBlank()) {
            user.setPhone(request.getMobileNumber());
        }

        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    @Override
    public List<AdminActivityLogDto> getAllActivityLogs(int page, int size) {
        // Trả về danh sách log hoạt động mẫu
        List<AdminActivityLogDto> logs = new ArrayList<>();
        
        AdminActivityLogDto log1 = new AdminActivityLogDto();
        log1.setAction("Modified Product 'Rivière Necklace'");
        log1.setModule("Inventory");
        log1.setDateTime(LocalDateTime.now().minusHours(2));
        log1.setStatus("SUCCESS");
        logs.add(log1);

        AdminActivityLogDto log2 = new AdminActivityLogDto();
        log2.setAction("Updated shipping policy VAT settings");
        log2.setModule("Finance");
        log2.setDateTime(LocalDateTime.now().minusDays(1));
        log2.setStatus("SUCCESS");
        logs.add(log2);

        AdminActivityLogDto log3 = new AdminActivityLogDto();
        log3.setAction("Added product category 'Diamond Earring'");
        log3.setModule("Inventory");
        log3.setDateTime(LocalDateTime.now().minusDays(3));
        log3.setStatus("SUCCESS");
        logs.add(log3);

        return logs;
    }
}
