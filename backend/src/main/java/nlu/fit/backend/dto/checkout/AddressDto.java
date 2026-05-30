package nlu.fit.backend.dto.checkout;

import lombok.Data;

@Data
public class AddressDto {
    private String firstName;
    private String lastName;
    private String streetAddress;
    private String city;
    private String postalCode;
    private String country;
}