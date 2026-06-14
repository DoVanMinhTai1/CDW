package nlu.fit.backend.service.impl;

import lombok.RequiredArgsConstructor;
import nlu.fit.backend.dto.CollectionDto;
import nlu.fit.backend.model.Collection;
import nlu.fit.backend.repository.CollectionRepository;
import nlu.fit.backend.service.CollectionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;

    @Override
    public List<CollectionDto> getCollections() {
        List<Collection> collections = collectionRepository.findAll();
        return collections.stream().map(c -> {
            CollectionDto dto = new CollectionDto();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setSlug(c.getSlug());
            dto.setCoverImage(c.getCoverImage());
            dto.setDescription(c.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }
}
