package QLNV.DTO.mapper;

import QLNV.DTO.request.EmployeeRequest;
import QLNV.DTO.response.EmployeeResponse;
import QLNV.DTO.response.PayrollResponse;
import QLNV.Entity.Employee;
import QLNV.Entity.Department;
import QLNV.Entity.Position;
import QLNV.Entity.Enum.EmployeeStatus;
import QLNV.Repository.DepartmentRepository;
import QLNV.Repository.PositionRepository;
import QLNV.Service.impl.MonthlyPayrollServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EmployeeMapper {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private MonthlyPayrollServiceImpl monthlyPayrollService;

    public void updateEntityFromRequest(Employee nv, EmployeeRequest request) {
        if (request.getMaNv() != null) nv.setMaNv(request.getMaNv());
        if (request.getHoTen() != null) nv.setHoTen(request.getHoTen());
        if (request.getNgaySinh() != null) nv.setNgaySinh(request.getNgaySinh());
        if (request.getGioiTinh() != null) nv.setGioiTinh(request.getGioiTinh());
        if (request.getFaceData() != null) nv.setFaceData(request.getFaceData());
        if (request.getCccd() != null) nv.setCccd(request.getCccd());
        if (request.getNgayCap() != null) nv.setNgayCap(request.getNgayCap());
        if (request.getNoiCap() != null) nv.setNoiCap(request.getNoiCap());
        if (request.getDiaChiThuongTru() != null) nv.setDiaChiThuongTru(request.getDiaChiThuongTru());
        if (request.getDiaChiHienTai() != null) nv.setDiaChiHienTai(request.getDiaChiHienTai());
        if (request.getSoDienThoai() != null) nv.setSoDienThoai(request.getSoDienThoai());
        if (request.getEmailCongTy() != null) nv.setEmailCongTy(request.getEmailCongTy());
        if (request.getEmailCaNhan() != null) nv.setEmailCaNhan(request.getEmailCaNhan());
        if (request.getMaSoThue() != null) nv.setMaSoThue(request.getMaSoThue());
        if (request.getSoTaiKhoan() != null) nv.setSoTaiKhoan(request.getSoTaiKhoan());
        if (request.getNganHang() != null) nv.setNganHang(request.getNganHang());
        if (request.getLuongCoBan() != null) nv.setLuongCoBan(request.getLuongCoBan());
        if (request.getHeSoLuong() != null) nv.setHeSoLuong(request.getHeSoLuong());
        if (request.getPhuCapCoDinh() != null) nv.setPhuCapCoDinh(request.getPhuCapCoDinh());
        if (request.getSoNguoiPhuThuoc() != null) nv.setSoNguoiPhuThuoc(request.getSoNguoiPhuThuoc());
        
        if (request.getTrangThai() != null) {
            nv.setTrangThai(EmployeeStatus.valueOf(request.getTrangThai()));
        }

        if (request.getPhongBanId() != null) {
            Department pb = departmentRepository.findById(request.getPhongBanId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy phòng ban ID: " + request.getPhongBanId()));
            nv.setPhongBan(pb);
        }

        if (request.getChucVuId() != null) {
            Position cv = positionRepository.findById(request.getChucVuId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy chức vụ ID: " + request.getChucVuId()));
            nv.setChucVu(cv);
        }
    }

    public EmployeeResponse toResponse(Employee nv) {
        if (nv == null) return null;
        EmployeeResponse res = new EmployeeResponse();

        res.setId(nv.getId());
        res.setMaNv(nv.getMaNv());
        res.setHoTen(nv.getHoTen());
        res.setNgaySinh(nv.getNgaySinh());
        res.setGioiTinh(nv.getGioiTinh());
        res.setAvatarUrl(nv.getAvatarUrl());
        res.setFaceData(nv.getFaceData());

        res.setCccd(nv.getCccd());
        res.setNgayCap(nv.getNgayCap());
        res.setNoiCap(nv.getNoiCap());

        res.setDiaChiThuongTru(nv.getDiaChiThuongTru());
        res.setDiaChiHienTai(nv.getDiaChiHienTai());

        res.setSoDienThoai(nv.getSoDienThoai());
        res.setEmailCongTy(nv.getEmailCongTy());
        res.setEmailCaNhan(nv.getEmailCaNhan());

        res.setMaSoThue(nv.getMaSoThue());
        res.setSoTaiKhoan(nv.getSoTaiKhoan());
        res.setNganHang(nv.getNganHang());
        
        res.setLuongCoBan(nv.getLuongCoBan());
        res.setHeSoLuong(nv.getHeSoLuong());
        res.setPhuCapCoDinh(nv.getPhuCapCoDinh());
        res.setSoNguoiPhuThuoc(nv.getSoNguoiPhuThuoc());

        res.setTenPhongBan(nv.getPhongBan() != null ? nv.getPhongBan().getTenPhongBan() : "Chưa phân bổ");
        res.setPhongBanId(nv.getPhongBan() != null ? nv.getPhongBan().getId() : null);
        
        res.setTenChucVu(nv.getChucVu() != null ? nv.getChucVu().getTenChucVu() : "Chưa có chức vụ");
        res.setChucVuId(nv.getChucVu() != null ? nv.getChucVu().getId() : null);
        
        res.setTrangThai(nv.getTrangThai() != null ? nv.getTrangThai().name() : "N/A");

        if (nv.getBangLuongThangs() != null) {
            List<PayrollResponse> payrollResponses = nv.getBangLuongThangs()
                    .stream()
                    .map(monthlyPayrollService::mapToPayrollResponse)
                    .toList();
            res.setBangLuongThangs(payrollResponses);
        }

        return res;
    }
}
