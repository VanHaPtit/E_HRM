package QLNV.Repository;

import QLNV.Entity.Dependent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DependentRepository extends JpaRepository<Dependent, Long> {

    // Tìm theo nhân viên
    List<Dependent> findByNhanVien_Id(Long nhanVienId);

    // Tìm theo MST
    List<Dependent> findByMaSoThue(String maSoThue);
}
