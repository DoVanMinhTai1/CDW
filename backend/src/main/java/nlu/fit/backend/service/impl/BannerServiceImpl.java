package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.BannerDto;
import nlu.fit.backend.model.Banner;
import nlu.fit.backend.repository.BannerRepository;
import nlu.fit.backend.service.BannerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<BannerDto> getActiveBanners() {
        List<Banner> banners = bannerRepository.findAllByIsActiveTrueOrderByPriorityDesc();
        return banners.stream().map(b -> {
            BannerDto dto = new BannerDto();
            dto.setId(b.getId());
            dto.setImageUrl(b.getImageUrl());
            dto.setLink(b.getLink());
            dto.setPriority(b.getPriority());
            return dto;
        }).collect(Collectors.toList());
    }
}
