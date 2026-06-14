package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.PromotionDto;
import nlu.fit.backend.model.Promotion;
import nlu.fit.backend.repository.PromotionRepository;
import nlu.fit.backend.service.PromotionService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    @Override
    public List<PromotionDto> getActivePromotions(int limit) {
        List<Promotion> promotions = promotionRepository.findByIsActiveTrueAndExpiresAtAfter(Instant.now());
        return promotions.stream().limit(limit).map(p -> {
            PromotionDto dto = new PromotionDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setType(p.getType());
            dto.setDiscount(p.getDiscount());
            dto.setDiscountType(p.getDiscountType());
            if (p.getProductIds() != null && !p.getProductIds().isEmpty()) {
                List<Long> ids = Arrays.stream(p.getProductIds().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .map(Long::valueOf)
                        .collect(Collectors.toList());
                dto.setProductIds(ids);
            }
            dto.setBannerUrl(p.getBannerUrl());
            dto.setExpiresAt(p.getExpiresAt());
            return dto;
        }).collect(Collectors.toList());
    }
}
