package QLNV.Repository;

import QLNV.Entity.MonthlyPayroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyPayrollRepository extends JpaRepository<MonthlyPayroll, Long> {

    List<MonthlyPayroll> findByNhanVienId(Long nhanVienId);

    Optional<MonthlyPayroll> findByNhanVienIdAndThangAndNam(Long nvId, Integer thang, Integer nam);
}
