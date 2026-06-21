package QLNV.Repository;

import QLNV.Entity.AnnualLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnnualLeaveRepository extends JpaRepository<AnnualLeave, Long> {
    // Tìm theo năm
    List<AnnualLeave> findByNam(Integer nam);

    // Tìm theo nhân viên
    List<AnnualLeave> findByNhanVienId(Long nhanVienId);

    // Tìm theo nhân viên và năm
    Optional<AnnualLeave> findByNhanVienIdAndNam(Long nhanVienId, Integer nam);
}
