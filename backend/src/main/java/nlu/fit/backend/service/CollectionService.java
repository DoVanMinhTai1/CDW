package nlu.fit.backend.service;

import nlu.fit.backend.dto.CollectionDto;

import java.util.List;

public interface CollectionService {
    List<CollectionDto> getCollections();
}
