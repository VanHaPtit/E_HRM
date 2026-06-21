package QLNV.Service.impl;

import QLNV.DTO.mapper.PositionMapper;
import QLNV.DTO.request.PositionRequest;
import QLNV.DTO.response.PositionResponse;
import QLNV.Entity.Position;
import QLNV.Repository.PositionRepository;
import QLNV.Service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PositionServiceImpl implements PositionService {

    @Autowired
    private PositionRepository chucVuRepository;

    @Autowired
    private PositionMapper mapper;

    @Override
    public List<PositionResponse> getAll() {
        return chucVuRepository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PositionResponse getChucVu(Long id) {
        return chucVuRepository.findById(id)
                .map(mapper::toResponse)
                .orElse(null);
    }

    @Override
    public PositionResponse saveChucVu(PositionRequest request) {
        Position entity = mapper.toEntity(request);
        Position saved = chucVuRepository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public void deleteChucVu(Long id) {
        chucVuRepository.deleteById(id);
    }

    @Override
    public PositionResponse updateChucVu(Long id, PositionRequest request) {
        return chucVuRepository.findById(id).map(cv -> {
            cv.setTenChucVu(request.getTenChucVu());
            cv.setCapBac(request.getCapBac());
            Position updated = chucVuRepository.save(cv);
            return mapper.toResponse(updated);
        }).orElse(null);
    }

    @Override
    public List<PositionResponse> searchChucVu(String keyword) {
        return chucVuRepository.findByTenChucVuContainingIgnoreCase(keyword).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}
