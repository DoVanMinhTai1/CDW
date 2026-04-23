package nlu.fit.CDW.repository;

import nlu.fit.CDW.model.ThanhVien;
//import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThanhVienRepository
//        extends JpaRepository<ThanhVien, String>
{
    List<ThanhVien> findByNu(boolean nu);
}
