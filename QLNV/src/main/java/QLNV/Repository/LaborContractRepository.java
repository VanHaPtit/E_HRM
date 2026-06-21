package QLNV.Repository;

import QLNV.Entity.LaborContract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LaborContractRepository extends JpaRepository<LaborContract, Long> {
    List<LaborContract> findByNhanVien_Id(Long nhanVienId);
}
