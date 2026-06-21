package QLNV.DTO.mapper;

import QLNV.DTO.request.LeaveRequestDTO;
import QLNV.DTO.response.LeaveResponseDTO;
import QLNV.Entity.Employee;
import QLNV.Entity.LeaveRequest;
import QLNV.Entity.Enum.LeaveType;
import QLNV.Entity.Enum.RequestStatus;
import QLNV.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LeaveRequestMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    public LeaveRequest toEntity(LeaveRequestDTO request) {
        if (request == null) return null;
        LeaveRequest entity = new LeaveRequest();

        if (request.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Nhân viên ID: " + request.getNhanVienId()));
            entity.setNhanVien(emp);
        }

        entity.setTuNgay(request.getTuNgay());
        entity.setDenNgay(request.getDenNgay());

        if (request.getLoaiNghi() != null) {
            entity.setLoaiNghi(LeaveType.valueOf(request.getLoaiNghi()));
        }

        if (request.getTrangThai() != null) {
            entity.setTrangThai(RequestStatus.valueOf(request.getTrangThai()));
        }

        if (request.getNguoiDuyetId() != null) {
            Employee nguoiDuyet = employeeRepository.findById(request.getNguoiDuyetId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Người duyệt ID: " + request.getNguoiDuyetId()));
            entity.setNguoiDuyet(nguoiDuyet);
        }

        return entity;
    }

    public LeaveResponseDTO toResponse(LeaveRequest entity) {
        if (entity == null) return null;
        LeaveResponseDTO response = new LeaveResponseDTO();

        response.setId(entity.getId());
        response.setTuNgay(entity.getTuNgay());
        response.setDenNgay(entity.getDenNgay());

        if (entity.getNhanVien() != null) {
            response.setNhanVienId(entity.getNhanVien().getId());
            response.setTenNhanVien(entity.getNhanVien().getHoTen());
        }

        if (entity.getLoaiNghi() != null) {
            response.setLoaiNghi(entity.getLoaiNghi().name());
        }

        if (entity.getTrangThai() != null) {
            response.setTrangThai(entity.getTrangThai().name());
        }

        if (entity.getNguoiDuyet() != null) {
            response.setNguoiDuyetId(entity.getNguoiDuyet().getId());
            response.setTenNguoiDuyet(entity.getNguoiDuyet().getHoTen());
        }

        return response;
    }
}
