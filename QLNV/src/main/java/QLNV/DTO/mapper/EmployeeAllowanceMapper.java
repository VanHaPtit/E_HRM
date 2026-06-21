package QLNV.DTO.mapper;

import QLNV.DTO.request.EmployeeAllowanceRequest;
import QLNV.DTO.response.EmployeeAllowanceResponse;
import QLNV.Entity.AllowanceConfig;
import QLNV.Entity.EmployeeAllowance;
import QLNV.Entity.LaborContract;
import QLNV.Repository.AllowanceConfigRepository;
import QLNV.Repository.LaborContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmployeeAllowanceMapper {

    @Autowired
    private LaborContractRepository laborContractRepository;

    @Autowired
    private AllowanceConfigRepository allowanceConfigRepository;

    public EmployeeAllowance toEntity(EmployeeAllowanceRequest request) {
        if (request == null) return null;
        EmployeeAllowance entity = new EmployeeAllowance();

        if (request.getHopDongId() != null) {
            LaborContract hd = laborContractRepository.findById(request.getHopDongId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Hợp đồng ID=" + request.getHopDongId()));
            entity.setHopDong(hd);
        }

        if (request.getPhuCapId() != null) {
            AllowanceConfig pc = allowanceConfigRepository.findById(request.getPhuCapId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Loại phụ cấp ID=" + request.getPhuCapId()));
            entity.setPhuCap(pc);
        }

        entity.setSoTien(request.getSoTien());
        return entity;
    }

    public EmployeeAllowanceResponse toResponse(EmployeeAllowance entity) {
        if (entity == null) return null;
        EmployeeAllowanceResponse response = new EmployeeAllowanceResponse();
        
        response.setId(entity.getId());
        
        if (entity.getHopDong() != null) {
            response.setHopDongId(entity.getHopDong().getId());
            response.setSoHopDong(entity.getHopDong().getSoHopDong());
            if (entity.getHopDong().getNhanVien() != null) {
                response.setTenNhanVien(entity.getHopDong().getNhanVien().getHoTen());
                response.setMaNv(entity.getHopDong().getNhanVien().getMaNv());
            }
        }

        if (entity.getPhuCap() != null) {
            response.setPhuCapId(entity.getPhuCap().getId());
            response.setTenPhuCap(entity.getPhuCap().getTenPhuCap());
        }

        response.setSoTien(entity.getSoTien());

        return response;
    }
}
