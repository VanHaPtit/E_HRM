package QLNV.Repository;

import QLNV.Entity.AttendanceDetail;
import QLNV.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceDetailRepository extends JpaRepository<AttendanceDetail, Long> {

    List<AttendanceDetail> findByNhanVien_Id(Long nhanVienId);

    List<AttendanceDetail> findByNhanVien_IdAndNgay(Long nhanVienId, LocalDate ngay);
    List<AttendanceDetail> findByNhanVien_IdAndNgayBetween(Long nhanVienId, LocalDate startDate, LocalDate endDate);
}
