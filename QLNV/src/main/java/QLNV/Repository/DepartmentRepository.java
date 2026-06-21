package QLNV.Repository;

import QLNV.Entity.Department;
import QLNV.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByTenPhongBanContainingIgnoreCase(String keyword);

    Optional<Department> findByTenPhongBan(String tenPhongBan);



}
