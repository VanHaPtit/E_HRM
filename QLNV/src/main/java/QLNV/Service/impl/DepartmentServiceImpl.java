package QLNV.Service.impl;

import QLNV.DTO.mapper.DepartmentMapper;
import QLNV.DTO.request.DepartmentRequest;
import QLNV.DTO.response.DepartmentResponse;
import QLNV.Entity.Department;
import QLNV.Repository.DepartmentRepository;
import QLNV.Service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository phongBanRepository;

    @Autowired
    private DepartmentMapper mapper;

    @Override
    public List<DepartmentResponse> getAll() {
        return phongBanRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse getPhongBan(Long id) {
        return phongBanRepository.findById(id)
                .map(mapper::toResponse)
                .orElse(null);
    }

    @Override
    public DepartmentResponse savePhongBan(DepartmentRequest request) {
        Department entity = mapper.toEntity(request);
        Department saved = phongBanRepository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public void deletePhongBan(Long id) {
        phongBanRepository.deleteById(id);
    }

    @Override
    public DepartmentResponse updatePhongBan(Long id, DepartmentRequest request) {
        return phongBanRepository.findById(id)
                .map(pb -> {
                    pb.setTenPhongBan(request.getTenPhongBan());
                    pb.setMoTa(request.getMoTa());
                    Department updated = phongBanRepository.save(pb);
                    return mapper.toResponse(updated);
                })
                .orElse(null);
    }

    @Override
    public List<DepartmentResponse> searchPhongBan(String keyword) {
        return phongBanRepository.findByTenPhongBanContainingIgnoreCase(keyword)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}