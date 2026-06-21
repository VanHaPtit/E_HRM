package QLNV.Repository;

import QLNV.Entity.LeaveRequest;
import QLNV.Entity.Enum.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    // Lấy đơn theo nhân viên
    List<LeaveRequest> findByNhanVien_Id(Long nhanVienId);

    // Lọc theo trạng thái
    List<LeaveRequest> findByTrangThai(RequestStatus trangThai);

    // Lọc theo khoảng thời gian
    List<LeaveRequest> findByTuNgayBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    // Lọc đơn đã duyệt của nhân viên trong một tháng
    List<LeaveRequest> findByNhanVien_IdAndTrangThaiAndTuNgayBetween(
            Long nhanVienId, RequestStatus trangThai, java.time.LocalDateTime start, java.time.LocalDateTime end);
}
