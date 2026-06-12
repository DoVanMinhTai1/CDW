package nlu.fit.backend.service;

import nlu.fit.backend.dto.BannerDto;

import java.util.List;

public interface BannerService {
    List<BannerDto> getActiveBanners();
}
