package QLNV.DTO.mapper;

import QLNV.DTO.request.LaborContractRequest;
import QLNV.DTO.response.LaborContractResponse;
import QLNV.Entity.Employee;
import QLNV.Entity.LaborContract;
import QLNV.Entity.Enum.ContractType;
import QLNV.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class LaborContractMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    public LaborContract toEntity(LaborContractRequest request) {
        if (request == null) return null;
        LaborContract entity = new LaborContract();
        
        if (request.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(request.getNhanVienId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Nhân viên ID=" + request.getNhanVienId()));
            entity.setNhanVien(emp);
        }

        entity.setSoHopDong(request.getSoHopDong());
        if (request.getLoaiHopDong() != null) {
            entity.setLoaiHopDong(ContractType.valueOf(request.getLoaiHopDong()));
        }
        entity.setNgayHieuLuc(request.getNgayHieuLuc());
        entity.setNgayHetHan(request.getNgayHetHan());
        entity.setLuongCoBan(request.getLuongCoBan());
        entity.setLuongDongBhxh(request.getLuongDongBhxh());
        entity.setFileDinhKem(request.getFileDinhKem());

        return entity;
    }

    public LaborContractResponse toResponse(LaborContract entity) {
        if (entity == null) return null;

        String tinhTrang = "Còn hạn";
        LocalDate today = LocalDate.now();
        if (entity.getNgayHetHan() != null) {
            if (today.isAfter(entity.getNgayHetHan())) {
                tinhTrang = "Hết hạn";
            } else if (java.time.temporal.ChronoUnit.DAYS.between(today, entity.getNgayHetHan()) <= 30) {
                tinhTrang = "Sắp hết hạn";
            }
        }

        return LaborContractResponse.builder()
                .id(entity.getId())
                .soHopDong(entity.getSoHopDong())
                .nhanVienId(entity.getNhanVien() != null ? entity.getNhanVien().getId() : null)
                .maNv(entity.getNhanVien() != null ? entity.getNhanVien().getMaNv() : "N/A")
                .hoTen(entity.getNhanVien() != null ? entity.getNhanVien().getHoTen() : "N/A")
                .loaiHopDong(entity.getLoaiHopDong() != null ? entity.getLoaiHopDong().name() : null)
                .ngayHieuLuc(entity.getNgayHieuLuc())
                .ngayHetHan(entity.getNgayHetHan())
                .luongCoBan(entity.getLuongCoBan())
                .luongDongBhxh(entity.getLuongDongBhxh())
                .fileDinhKemUrl(entity.getFileDinhKem())
                .fileDinhKem(entity.getFileDinhKem())
                .tinhTrangHieuLuc(tinhTrang)
                .nhanVien(entity.getNhanVien() != null ? LaborContractResponse.NhanVienDto.builder()
                        .id(entity.getNhanVien().getId())
                        .maNv(entity.getNhanVien().getMaNv())
                        .hoTen(entity.getNhanVien().getHoTen())
                        .build() : null)
                .build();
    }
}
