package QLNV.Service.impl;

import QLNV.DTO.mapper.AnnualLeaveMapper;
import QLNV.DTO.request.AnnualLeaveRequest;
import QLNV.DTO.response.AnnualLeaveResponse;
import QLNV.Entity.AnnualLeave;
import QLNV.Entity.Employee;
import QLNV.Repository.AnnualLeaveRepository;
import QLNV.Repository.EmployeeRepository;
import QLNV.Service.QuyPhepNamService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnualLeaveServiceImpl implements QuyPhepNamService {

    private final AnnualLeaveRepository repository;
    private final EmployeeRepository employeeRepository;
    private final AnnualLeaveMapper mapper;

    public AnnualLeaveServiceImpl(AnnualLeaveRepository repository, EmployeeRepository employeeRepository, AnnualLeaveMapper mapper) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
        this.mapper = mapper;
    }

    @Override
    public List<AnnualLeaveResponse> getAll() {
        return repository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public AnnualLeaveResponse getById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy QuyPhepNam id = " + id));
    }

    @Override
    public AnnualLeaveResponse create(AnnualLeaveRequest request) {
        AnnualLeave entity = mapper.toEntity(request);
        AnnualLeave saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public AnnualLeaveResponse update(Long id, AnnualLeaveRequest request) {
        AnnualLeave old = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy QuyPhepNam id = " + id));

        if (request.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Nhân viên ID=" + request.getNhanVienId()));
            old.setNhanVien(emp);
        }

        old.setNam(request.getNam());
        old.setTongPhepDuocCap(request.getTongPhepDuocCap());
        old.setPhepDaNghi(request.getPhepDaNghi());
        old.setPhepTonNamTruoc(request.getPhepTonNamTruoc());

        return mapper.toResponse(repository.save(old));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<AnnualLeaveResponse> findByNam(Integer nam) {
        return repository.findByNam(nam).stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<AnnualLeaveResponse> findByNhanVien(Long nhanVienId) {
        return repository.findByNhanVienId(nhanVienId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<AnnualLeaveResponse> findByNhanVienAndNam(Long nhanVienId, Integer nam) {
        return repository.findByNhanVienIdAndNam(nhanVienId, nam).stream().map(mapper::toResponse).collect(Collectors.toList());
    }

}
