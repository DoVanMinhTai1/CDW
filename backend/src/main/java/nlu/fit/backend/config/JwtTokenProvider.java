package nlu.fit.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    // Tạo khóa bí mật chuẩn thuật toán HS256
    private final Key jwtSecret = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Thời gian hết hạn của token: 24 giờ (tính bằng mili-giây)
    private final long JWT_EXPIRATION = 86400000L;

    // === HÀM GENERATE TOKEN BẠN CẦN BỔ SUNG ===
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(email) // Lưu email vào phần Subject của token
                .setIssuedAt(now)   // Thời gian tạo
                .setExpiration(expiryDate) // Thời gian hết hạn
                .signWith(jwtSecret) // Ký bằng secret key bí mật
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).build().parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            // Bạn nên log lỗi ra để dễ debug khi token hết hạn hoặc sai định dạng
            // System.out.println("JWT Validation Error: " + ex.getMessage());
        }
        return false;
    }
}