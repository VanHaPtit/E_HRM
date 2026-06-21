package QLNV.Service;

import QLNV.DTO.request.LaborContractRequest;
import QLNV.DTO.response.LaborContractResponse;
import QLNV.Entity.LaborContract;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface LaborContractService {
    LaborContractResponse create(LaborContractRequest request, MultipartFile file) throws IOException;
    LaborContractResponse update(Long id, LaborContractRequest request, MultipartFile file) throws IOException;
    void delete(Long id);
    LaborContractResponse getById(Long id);
    List<LaborContractResponse> getAll();
    List<LaborContractResponse> getByNhanVienId(Long nhanVienId);
}