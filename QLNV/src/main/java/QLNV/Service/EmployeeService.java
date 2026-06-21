package QLNV.Service;

import QLNV.DTO.request.EmployeeRequest;
import QLNV.DTO.response.EmployeeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<EmployeeResponse> getAll();
    Optional<EmployeeResponse> getById(Long id);
    EmployeeResponse save(EmployeeRequest request, MultipartFile file) throws IOException;
    EmployeeResponse update(Long id, EmployeeRequest request, MultipartFile file) throws IOException;
    void delete(Long id);
    EmployeeResponse findByMaNv(String maNv);
}
