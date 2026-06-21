package QLNV.Service.impl;

import QLNV.DTO.mapper.EmployeeAllowanceMapper;
import QLNV.DTO.request.EmployeeAllowanceRequest;
import QLNV.DTO.response.EmployeeAllowanceResponse;
import QLNV.Entity.EmployeeAllowance;
import QLNV.Entity.AllowanceConfig;
import QLNV.Entity.LaborContract;
import QLNV.Repository.EmployeeAllowanceRepository;
import QLNV.Repository.LaborContractRepository;
import QLNV.Repository.AllowanceConfigRepository;
import QLNV.Service.EmployeeAllowanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeAllowanceServiceImpl implements EmployeeAllowanceService {

    private final EmployeeAllowanceRepository repo;
    private final LaborContractRepository laborContractRepository;
    private final AllowanceConfigRepository allowanceConfigRepository;
    private final EmployeeAllowanceMapper mapper;

    public EmployeeAllowanceServiceImpl(EmployeeAllowanceRepository repo, LaborContractRepository laborContractRepository, AllowanceConfigRepository allowanceConfigRepository, EmployeeAllowanceMapper mapper) {
        this.repo = repo;
        this.laborContractRepository = laborContractRepository;
        this.allowanceConfigRepository = allowanceConfigRepository;
        this.mapper = mapper;
    }

    @Override
    public List<EmployeeAllowanceResponse> getAll() {
        return repo.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public EmployeeAllowanceResponse getById(Long id) {
        return repo.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ cấp nhân viên id = " + id));
    }

    @Override
    public EmployeeAllowanceResponse create(EmployeeAllowanceRequest request) {
        EmployeeAllowance entity = mapper.toEntity(request);
        EmployeeAllowance saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public EmployeeAllowanceResponse update(Long id, EmployeeAllowanceRequest request) {
        EmployeeAllowance old = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ cấp nhân viên id = " + id));
        
        if (request.getHopDongId() != null) {
            LaborContract hd = laborContractRepository.findById(request.getHopDongId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Hợp đồng ID=" + request.getHopDongId()));
            old.setHopDong(hd);
        }

        if (request.getPhuCapId() != null) {
            AllowanceConfig pc = allowanceConfigRepository.findById(request.getPhuCapId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Phụ cấp ID=" + request.getPhuCapId()));
            old.setPhuCap(pc);
        }

        old.setSoTien(request.getSoTien());
        
        return mapper.toResponse(repo.save(old));
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<EmployeeAllowanceResponse> findByHopDong(Long hopDongId) {
        return repo.findByHopDongId(hopDongId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<EmployeeAllowanceResponse> findByPhuCap(Long phuCapId) {
        return repo.findByPhuCapId(phuCapId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}
