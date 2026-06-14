package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.config.JwtTokenProvider;
import nlu.fit.backend.dto.auth.AuthResponse;
import nlu.fit.backend.dto.auth.LoginRequest;
import nlu.fit.backend.dto.auth.RegisterRequest;
import nlu.fit.backend.exception.BadRequestException;
import nlu.fit.backend.exception.ResourceNotFoundException;
import nlu.fit.backend.model.Role;
import nlu.fit.backend.model.User;
import nlu.fit.backend.repository.RoleRepository;
import nlu.fit.backend.repository.UserRepository;
import nlu.fit.backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean checkEmailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email đã được sử dụng!");
        }

        User account = new User();
        account.setEmail(request.getEmail());
        account.setUsername(request.getEmail().split("@")[0]); // Set default username from email
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setFullName(request.getFullName());
        account.setCreatedAt(Instant.now());
        account.setUpdatedAt(Instant.now());
        account.setStatus((byte) 1);

        // Find or create default ROLE_USER
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ROLE_USER");
                    return roleRepository.save(newRole);
                });
        account.setRoles(new ArrayList<>(Collections.singletonList(userRole)));

        userRepository.save(account);
        return "Đăng ký tài khoản thành công!";
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User account = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email hoặc mật khẩu không chính xác!"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new BadRequestException("Email hoặc mật khẩu không chính xác!");
        }

        if (account.getStatus() == 0) {
            throw new BadRequestException("Tài khoản đã bị khóa!");
        }

//        String mockToken = "eyJhbGciOiJIUzI1NiJ9.mockTokenTừBackendNLU...";
        String token = jwtTokenProvider.generateToken(account.getEmail());
        List<String> roleNames = account.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        System.out.println(roleNames);
        return new AuthResponse(
                token,
                account.getEmail(),
                account.getFullName() != null ? account.getFullName() : "User",
                account.getUsername(),
                roleNames
        );
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
    }
}
