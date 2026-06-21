package QLNV.Service.impl;

import QLNV.DTO.response.LeaveRequestResponse;
import QLNV.Entity.LeaveRequest;
import QLNV.Entity.Enum.RequestStatus;
import QLNV.Entity.Employee;
import QLNV.Repository.LeaveRequestRepository;
import QLNV.Repository.EmployeeRepository;
import QLNV.Service.LeaveRequestService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository repo;
    private final EmployeeRepository nhanVienRepo;

    public LeaveRequestServiceImpl(LeaveRequestRepository repo, EmployeeRepository nhanVienRepo) {
        this.repo = repo;
        this.nhanVienRepo = nhanVienRepo;
    }

    @Override
    public List<LeaveRequest> getAll() {
        return repo.findAll();
    }

    @Override
    public LeaveRequest getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin phép ID=" + id));
    }

    @Override
    public LeaveRequest create(LeaveRequest data) {
        if (data.getTuNgay() != null && data.getDenNgay() != null) {
            if (!data.getTuNgay().isBefore(data.getDenNgay())) {
                throw new RuntimeException("Thời điểm xin nghỉ phải nhỏ hơn thời điểm kết thúc xin nghỉ");
            }
        }
        data.setTrangThai(RequestStatus.CHO_DUYET);
        return repo.save(data);
    }

    @Override
    public LeaveRequest update(Long id, LeaveRequest data) {
        LeaveRequest old = getById(id);

        if (data.getTuNgay() != null && data.getDenNgay() != null) {
            if (!data.getTuNgay().isBefore(data.getDenNgay())) {
                throw new RuntimeException("Thời điểm xin nghỉ phải nhỏ hơn thời điểm kết thúc xin nghỉ");
            }
        }

        old.setNhanVien(data.getNhanVien());
        old.setTuNgay(data.getTuNgay());
        old.setDenNgay(data.getDenNgay());
        old.setLoaiNghi(data.getLoaiNghi());
        old.setTrangThai(data.getTrangThai());
        old.setNguoiDuyet(data.getNguoiDuyet());

        return repo.save(old);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<LeaveRequest> findByNhanVien(Long nvId) {
        return repo.findByNhanVien_Id(nvId);
    }

    @Override
    public List<LeaveRequest> findByTrangThai(RequestStatus status) {
        return repo.findByTrangThai(status);
    }


    @Override
    public LeaveRequest approveDon(Long id, Long nguoiDuyetId) {
        LeaveRequest don = getById(id);

        Employee nguoiDuyet = nhanVienRepo.findById(nguoiDuyetId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người duyệt"));

        don.setTrangThai(RequestStatus.DA_DUYET);
        don.setNguoiDuyet(nguoiDuyet);

        return repo.save(don);
    }

    @Override
    public LeaveRequest rejectDon(Long id, Long nguoiDuyetId) {
        LeaveRequest don = getById(id);

        Employee nguoiDuyet = nhanVienRepo.findById(nguoiDuyetId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người duyệt"));

        don.setTrangThai(RequestStatus.TU_CHOI);
        don.setNguoiDuyet(nguoiDuyet);

        return repo.save(don);
    }

    private LeaveRequestResponse mapToLeaveResponse(LeaveRequest don) {
        LeaveRequestResponse res = new LeaveRequestResponse();
        res.setId(don.getId());
        res.setLoaiNghi(don.getLoaiNghi().name());
        res.setTuNgay(don.getTuNgay());
        res.setDenNgay(don.getDenNgay());
        res.setTrangThai(don.getTrangThai().name());

        if (don.getNguoiDuyet() != null) {
            res.setTenNguoiDuyet(don.getNguoiDuyet().getHoTen());
        }

        return res;
    }

}
