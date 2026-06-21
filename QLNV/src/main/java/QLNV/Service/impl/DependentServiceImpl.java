package QLNV.Service.impl;

import QLNV.DTO.mapper.DependentMapper;
import QLNV.DTO.request.DependentRequest;
import QLNV.DTO.response.DependentResponse;
import QLNV.Entity.Dependent;
import QLNV.Entity.Employee;
import QLNV.Repository.DependentRepository;
import QLNV.Repository.EmployeeRepository;
import QLNV.Service.DependentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DependentServiceImpl implements DependentService {

    private final DependentRepository repository;
    private final EmployeeRepository employeeRepository;
    private final DependentMapper mapper;

    public DependentServiceImpl(DependentRepository repository, EmployeeRepository employeeRepository, DependentMapper mapper) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
        this.mapper = mapper;
    }

    @Override
    public List<DependentResponse> getAll() {
        return repository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public DependentResponse getById(Long id) {
        Dependent entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người phụ thuộc ID=" + id));
        return mapper.toResponse(entity);
    }

    @Override
    public DependentResponse create(DependentRequest data) {
        Dependent entity = mapper.toEntity(data);
        Dependent saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public DependentResponse update(Long id, DependentRequest data) {
        Dependent old = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người phụ thuộc ID=" + id));

        if (data.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(data.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Employee với ID: " + data.getNhanVienId()));
            old.setNhanVien(emp);
        }

        old.setHoTenNguoiThan(data.getHoTenNguoiThan());
        old.setQuanHe(data.getQuanHe());
        old.setNgaySinh(data.getNgaySinh());
        old.setMaSoThue(data.getMaSoThue());
        old.setNgayBatDauGiamTru(data.getNgayBatDauGiamTru());
        old.setNgayKetThucGiamTru(data.getNgayKetThucGiamTru());

        Dependent saved = repository.save(old);
        return mapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<DependentResponse> findByNhanVien(Long nvId) {
        return repository.findByNhanVien_Id(nvId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<DependentResponse> findByMaSoThue(String mst) {
        return repository.findByMaSoThue(mst).stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}