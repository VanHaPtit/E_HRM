package QLNV.Repository;

import QLNV.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByTenChucVuContainingIgnoreCase(String keyword);


    Optional<Position> findByTenChucVu(String cv) ;
}
