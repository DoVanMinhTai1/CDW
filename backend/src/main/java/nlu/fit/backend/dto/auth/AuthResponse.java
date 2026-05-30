package nlu.fit.backend.dto.auth;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;

    public AuthResponse(String token, String email, String fullName) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
    }
}