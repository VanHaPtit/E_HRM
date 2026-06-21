package QLNV.Service;

import QLNV.DTO.request.DepartmentRequest;
import QLNV.DTO.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> getAll();
    DepartmentResponse getPhongBan(Long id);
    DepartmentResponse savePhongBan(DepartmentRequest request);
    void deletePhongBan(Long id);
    DepartmentResponse updatePhongBan(Long id, DepartmentRequest request);
    List<DepartmentResponse> searchPhongBan(String keyword);
}
