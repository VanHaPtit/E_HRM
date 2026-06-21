package QLNV.Service.impl;

import QLNV.DTO.mapper.LaborContractMapper;
import QLNV.DTO.request.LaborContractRequest;
import QLNV.DTO.response.LaborContractResponse;
import QLNV.Entity.Employee;
import QLNV.Entity.LaborContract;
import QLNV.Entity.Enum.ContractType;
import QLNV.Repository.LaborContractRepository;
import QLNV.Repository.EmployeeRepository;
import QLNV.Service.CloudinaryService;
import QLNV.Service.LaborContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LaborContractServiceImpl implements LaborContractService {

    private final LaborContractRepository repo;
    private final EmployeeRepository nhanVienRepo;
    private final CloudinaryService cloudinaryService;
    private final LaborContractMapper mapper;

    public LaborContractServiceImpl(LaborContractRepository repo, EmployeeRepository nhanVienRepo, CloudinaryService cloudinaryService, LaborContractMapper mapper) {
        this.repo = repo;
        this.nhanVienRepo = nhanVienRepo;
        this.cloudinaryService = cloudinaryService;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public LaborContractResponse create(LaborContractRequest request, MultipartFile file) throws IOException {
        if (request.getNgayHetHan() != null && request.getNgayHieuLuc().isAfter(request.getNgayHetHan())) {
            throw new RuntimeException("Ngày có hiệu lực phải bé hơn ngày hết hạn");
        }
        
        LaborContract hd = mapper.toEntity(request);

        if (file != null && !file.isEmpty()) {
            hd.setFileDinhKem(cloudinaryService.uploadImage(file));
        }

        return mapper.toResponse(repo.save(hd));
    }

    @Override
    @Transactional
    public LaborContractResponse update(Long id, LaborContractRequest request, MultipartFile file) throws IOException {
        if (request.getNgayHetHan() != null && request.getNgayHieuLuc().isAfter(request.getNgayHetHan())) {
            throw new RuntimeException("Ngày có hiệu lực phải bé hơn ngày hết hạn");
        }
        
        LaborContract hd = repo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng"));

        hd.setSoHopDong(request.getSoHopDong());
        hd.setNgayHieuLuc(request.getNgayHieuLuc());
        hd.setNgayHetHan(request.getNgayHetHan());
        hd.setLuongCoBan(request.getLuongCoBan());
        hd.setLuongDongBhxh(request.getLuongDongBhxh());
        if (request.getLoaiHopDong() != null) {
            hd.setLoaiHopDong(ContractType.valueOf(request.getLoaiHopDong()));
        }

        if (request.getNhanVienId() != null) {
            Employee nv = nhanVienRepo.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
            hd.setNhanVien(nv);
        }

        if (file != null && !file.isEmpty()) {
            hd.setFileDinhKem(cloudinaryService.uploadImage(file));
        } else {
            // Keep the old file if not replacing and the request holds the old URL
            if (request.getFileDinhKem() != null && !request.getFileDinhKem().isEmpty()) {
                hd.setFileDinhKem(request.getFileDinhKem());
            }
        }

        return mapper.toResponse(repo.save(hd));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LaborContractResponse> getAll() {
        return repo.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LaborContractResponse> getByNhanVienId(Long nhanVienId) {
        return repo.findByNhanVien_Id(nhanVienId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LaborContractResponse getById(Long id) {
        return mapper.toResponse(repo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng")));
    }

    @Override
    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}