package QLNV.Service;

import QLNV.DTO.request.PositionRequest;
import QLNV.DTO.response.PositionResponse;

import java.util.List;

public interface PositionService {
    List<PositionResponse> getAll();

    PositionResponse getChucVu(Long id);

    PositionResponse saveChucVu(PositionRequest request);

    void deleteChucVu(Long id);

    PositionResponse updateChucVu(Long id, PositionRequest request);

    List<PositionResponse> searchChucVu(String keyword);
}
