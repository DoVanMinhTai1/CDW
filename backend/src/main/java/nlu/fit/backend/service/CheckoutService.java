package nlu.fit.backend.service;

import nlu.fit.backend.dto.checkout.AddressDto;
import nlu.fit.backend.dto.checkout.InitCheckoutRequest;
import nlu.fit.backend.dto.checkout.OrderReviewResponseDto;

public interface CheckoutService {
    AddressDto getDefaultAddress(String email);
    
    OrderReviewResponseDto calculateOrderSummary(String email, AddressDto address);
    
    String continueToReview(String email, InitCheckoutRequest request);
}
