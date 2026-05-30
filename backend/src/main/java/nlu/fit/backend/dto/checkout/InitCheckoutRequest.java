package nlu.fit.backend.dto.checkout;

import lombok.Data;

@Data
public class InitCheckoutRequest {
    private AddressDto shippingAddress;
    private String paymentMethod; // "CREDIT_CARD" hoặc "BANK_TRANSFER"
}