package QLNV.Repository;

import QLNV.Entity.EmployeeAllowance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeAllowanceRepository extends JpaRepository<EmployeeAllowance, Long> {

    // Tìm theo mã hợp đồng
    List<EmployeeAllowance> findByHopDongId(Long hopDongId);

    // Tìm theo mã phụ cấp
    List<EmployeeAllowance> findByPhuCapId(Long phuCapId);
}
