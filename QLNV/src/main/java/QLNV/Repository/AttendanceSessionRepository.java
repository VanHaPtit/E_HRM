package QLNV.Repository;

import QLNV.Entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    // Lấy phiên mới nhất đang hoạt động
    Optional<AttendanceSession> findTopByDangHoatDongTrueOrderByNgayTaoDesc();
}
