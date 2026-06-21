package QLNV.DTO.response;

import QLNV.Entity.MonthlyPayroll;
import jakarta.persistence.Column;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class EmployeeResponse {
    private Long id;
    private String maNv;
    private String hoTen;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String avatarUrl;
    private String faceData;

    private String cccd;
    private LocalDate ngayCap;
    private String noiCap;
    private String diaChiThuongTru;
    private String diaChiHienTai;
    private String soDienThoai;
    private String emailCongTy;
    private String emailCaNhan;
    private String maSoThue;
    private String soTaiKhoan;
    private String nganHang;
    private String tenPhongBan;
    private Long phongBanId;
    private String tenChucVu;
    private Long chucVuId;
    private String trangThai;
    private List<PayrollResponse> bangLuongThangs;
    private BigDecimal luongCoBan;
    private Double heSoLuong;
    private BigDecimal phuCapCoDinh;
    private Integer soNguoiPhuThuoc;
}
