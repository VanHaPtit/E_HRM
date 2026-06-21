package QLNV.DTO.mapper;

import QLNV.DTO.request.AnnualLeaveRequest;
import QLNV.DTO.response.AnnualLeaveResponse;
import QLNV.Entity.AnnualLeave;
import QLNV.Entity.Employee;
import QLNV.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AnnualLeaveMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    public AnnualLeave toEntity(AnnualLeaveRequest request) {
        if (request == null) return null;
        AnnualLeave entity = new AnnualLeave();

        if (request.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Nhân viên ID=" + request.getNhanVienId()));
            entity.setNhanVien(emp);
        }

        entity.setNam(request.getNam());
        entity.setTongPhepDuocCap(request.getTongPhepDuocCap());
        entity.setPhepDaNghi(request.getPhepDaNghi());
        entity.setPhepTonNamTruoc(request.getPhepTonNamTruoc());

        return entity;
    }

    public AnnualLeaveResponse toResponse(AnnualLeave entity) {
        if (entity == null) return null;
        AnnualLeaveResponse response = new AnnualLeaveResponse();

        response.setId(entity.getId());
        if (entity.getNhanVien() != null) {
            response.setNhanVienId(entity.getNhanVien().getId());
            response.setTenNhanVien(entity.getNhanVien().getHoTen());
            response.setMaNv(entity.getNhanVien().getMaNv());
        }
        response.setNam(entity.getNam());
        response.setTongPhepDuocCap(entity.getTongPhepDuocCap());
        response.setPhepDaNghi(entity.getPhepDaNghi());
        response.setPhepTonNamTruoc(entity.getPhepTonNamTruoc());

        return response;
    }
}
