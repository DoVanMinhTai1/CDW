package nlu.fit.backend.service;

import nlu.fit.backend.dto.auth.AuthResponse;
import nlu.fit.backend.dto.auth.LoginRequest;
import nlu.fit.backend.dto.auth.RegisterRequest;
import nlu.fit.backend.model.User;

public interface UserService {
    boolean checkEmailExists(String email);
    
    String register(RegisterRequest request);
    
    AuthResponse login(LoginRequest request);
    
    User findByEmail(String email);
}
