package nlu.fit.backend.repository;

import nlu.fit.backend.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findAllByIsActiveTrueOrderByPriorityDesc();
}
