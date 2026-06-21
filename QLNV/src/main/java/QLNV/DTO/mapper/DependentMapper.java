package QLNV.DTO.mapper;

import QLNV.DTO.request.DependentRequest;
import QLNV.DTO.response.DependentResponse;
import QLNV.Entity.Dependent;
import QLNV.Entity.Employee;
import QLNV.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DependentMapper {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Dependent toEntity(DependentRequest request) {
        if (request == null) return null;
        Dependent entity = new Dependent();
        
        if (request.getNhanVienId() != null) {
            Employee emp = employeeRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Employee với ID: " + request.getNhanVienId()));
            entity.setNhanVien(emp);
        }
        
        entity.setHoTenNguoiThan(request.getHoTenNguoiThan());
        entity.setQuanHe(request.getQuanHe());
        entity.setNgaySinh(request.getNgaySinh());
        entity.setMaSoThue(request.getMaSoThue());
        entity.setNgayBatDauGiamTru(request.getNgayBatDauGiamTru());
        entity.setNgayKetThucGiamTru(request.getNgayKetThucGiamTru());
        return entity;
    }

    public DependentResponse toResponse(Dependent entity) {
        if (entity == null) return null;
        DependentResponse response = new DependentResponse();
        response.setId(entity.getId());
        
        if (entity.getNhanVien() != null) {
            response.setNhanVienId(entity.getNhanVien().getId());
            response.setTenNhanVien(entity.getNhanVien().getHoTen());
            response.setMaNv(entity.getNhanVien().getMaNv());
        }
        
        response.setHoTenNguoiThan(entity.getHoTenNguoiThan());
        response.setQuanHe(entity.getQuanHe());
        response.setNgaySinh(entity.getNgaySinh());
        response.setMaSoThue(entity.getMaSoThue());
        response.setNgayBatDauGiamTru(entity.getNgayBatDauGiamTru());
        response.setNgayKetThucGiamTru(entity.getNgayKetThucGiamTru());
        return response;
    }
}
