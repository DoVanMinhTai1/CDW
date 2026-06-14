package nlu.fit.backend.dto.auth;

import lombok.Data;

import java.util.List;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String username;
    private List<String> roles;

    public AuthResponse(String token, String email, String fullName, String username, List<String> roles) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.username = username;
        this.roles = roles;
    }
}