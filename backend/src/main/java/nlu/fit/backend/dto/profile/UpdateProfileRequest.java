package nlu.fit.backend.dto.profile;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String primaryShippingAddress;
}