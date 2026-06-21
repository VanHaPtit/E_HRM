package QLNV.Service;

import QLNV.DTO.request.DependentRequest;
import QLNV.DTO.response.DependentResponse;

import java.util.List;

public interface DependentService {

    List<DependentResponse> getAll();
    DependentResponse getById(Long id);
    DependentResponse create(DependentRequest data);
    DependentResponse update(Long id, DependentRequest data);
    void delete(Long id);

    // Thêm filter
    List<DependentResponse> findByNhanVien(Long nvId);
    List<DependentResponse> findByMaSoThue(String mst);
}
