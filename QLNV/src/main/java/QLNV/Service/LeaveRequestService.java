package QLNV.Service;

import QLNV.Entity.LeaveRequest;
import QLNV.Entity.Enum.RequestStatus;

import java.util.List;

public interface LeaveRequestService {

    List<LeaveRequest> getAll();
    LeaveRequest getById(Long id);
    LeaveRequest create(LeaveRequest data);
    LeaveRequest update(Long id, LeaveRequest data);
    void delete(Long id);

    // Filtering
    List<LeaveRequest> findByNhanVien(Long nvId);
    List<LeaveRequest> findByTrangThai(RequestStatus status);

    // Chức năng duyệt đơn
    LeaveRequest approveDon(Long id, Long nguoiDuyetId);
    LeaveRequest rejectDon(Long id, Long nguoiDuyetId);
}
