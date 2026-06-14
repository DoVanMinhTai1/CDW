package nlu.fit.backend.service;

import nlu.fit.backend.dto.PromotionDto;

import java.util.List;

public interface PromotionService {
    List<PromotionDto> getActivePromotions(int limit);
}
