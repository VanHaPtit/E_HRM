package QLNV.Service;

import QLNV.DTO.request.AnnualLeaveRequest;
import QLNV.DTO.response.AnnualLeaveResponse;

import java.util.List;

public interface QuyPhepNamService {
    List<AnnualLeaveResponse> getAll();
    AnnualLeaveResponse getById(Long id);
    AnnualLeaveResponse create(AnnualLeaveRequest request);
    AnnualLeaveResponse update(Long id, AnnualLeaveRequest request);
    void delete(Long id);
    List<AnnualLeaveResponse> findByNam(Integer nam);

    List<AnnualLeaveResponse> findByNhanVien(Long nhanVienId);

    List<AnnualLeaveResponse> findByNhanVienAndNam(Long nhanVienId, Integer nam);
}
