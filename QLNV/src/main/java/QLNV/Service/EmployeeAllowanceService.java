package QLNV.Service;

import QLNV.DTO.request.EmployeeAllowanceRequest;
import QLNV.DTO.response.EmployeeAllowanceResponse;

import java.util.List;

public interface EmployeeAllowanceService {
    List<EmployeeAllowanceResponse> getAll();
    EmployeeAllowanceResponse getById(Long id);
    EmployeeAllowanceResponse create(EmployeeAllowanceRequest request);
    EmployeeAllowanceResponse update(Long id, EmployeeAllowanceRequest request);
    void delete(Long id);

    List<EmployeeAllowanceResponse> findByHopDong(Long hopDongId);
    List<EmployeeAllowanceResponse> findByPhuCap(Long phuCapId);
}
