package QLNV.DTO.mapper;

import QLNV.DTO.request.AttendanceDetailRequest;
import QLNV.DTO.response.AttendanceDetailResponse;
import QLNV.Entity.AttendanceDetail;
import QLNV.Entity.AttendanceSession;
import QLNV.Entity.Employee;
import QLNV.Entity.Enum.DayType;
import QLNV.Repository.AttendanceSessionRepository;
import QLNV.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AttendanceDetailMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceSessionRepository sessionRepository;

    public AttendanceDetail toEntity(AttendanceDetailRequest request) {
        if (request == null) return null;
        AttendanceDetail entity = new AttendanceDetail();

        if (request.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Nhân viên ID=" + request.getNhanVienId()));
            entity.setNhanVien(emp);
        }

        if (request.getPhienDiemDanhId() != null) {
            AttendanceSession session = sessionRepository.findById(request.getPhienDiemDanhId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Phiên điểm danh ID=" + request.getPhienDiemDanhId()));
            entity.setPhienDiemDanh(session);
        }

        entity.setNgay(request.getNgay());
        entity.setGioCheckIn(request.getGioCheckIn());
        entity.setGioCheckOut(request.getGioCheckOut());
        entity.setSoPhutDiTre(request.getSoPhutDiTre());
        entity.setSoPhutVeSom(request.getSoPhutVeSom());
        entity.setCongThuong(request.getCongThuong());
        entity.setGioTangCa(request.getGioTangCa());

        if (request.getLoaiNgay() != null) {
            entity.setLoaiNgay(DayType.valueOf(request.getLoaiNgay()));
        }

        return entity;
    }

    public AttendanceDetailResponse toResponse(AttendanceDetail entity) {
        if (entity == null) return null;
        return AttendanceDetailResponse.builder()
                .id(entity.getId())
                .nhanVienId(entity.getNhanVien() != null ? entity.getNhanVien().getId() : null)
                .maNv(entity.getNhanVien() != null ? entity.getNhanVien().getMaNv() : null)
                .hoTen(entity.getNhanVien() != null ? entity.getNhanVien().getHoTen() : null)
                .phienDiemDanhId(entity.getPhienDiemDanh() != null ? entity.getPhienDiemDanh().getId() : null)
                .ngay(entity.getNgay())
                .gioCheckIn(entity.getGioCheckIn())
                .gioCheckOut(entity.getGioCheckOut())
                .soPhutDiTre(entity.getSoPhutDiTre())
                .soPhutVeSom(entity.getSoPhutVeSom())
                .congThuong(entity.getCongThuong())
                .gioTangCa(entity.getGioTangCa())
                .loaiNgay(entity.getLoaiNgay() != null ? entity.getLoaiNgay().name() : null)
                .build();
    }
}
