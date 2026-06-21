package QLNV.DTO.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class LaborContractRequest {
    @NotBlank(message = "Số hợp đồng không được để trống")
    private String soHopDong;

    @NotNull(message = "ID nhân viên không được để trống")
    private Long nhanVienId;

    @NotBlank(message = "Loại hợp đồng không được để trống")
    private String loaiHopDong;

    @NotNull(message = "Ngày hiệu lực không được để trống")
    private LocalDate ngayHieuLuc;

    private LocalDate ngayHetHan;
    
    @PositiveOrZero(message = "Lương cơ bản không được là số âm")
    private BigDecimal luongCoBan;
    
    @PositiveOrZero(message = "Lương đóng BHXH không được là số âm")
    private BigDecimal luongDongBhxh;
    private String fileDinhKem;

    public LaborContractRequest() {}

    // Getters and Setters
    public String getSoHopDong() { return soHopDong; }
    public void setSoHopDong(String soHopDong) { this.soHopDong = soHopDong; }

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public String getLoaiHopDong() { return loaiHopDong; }
    public void setLoaiHopDong(String loaiHopDong) { this.loaiHopDong = loaiHopDong; }

    public LocalDate getNgayHieuLuc() { return ngayHieuLuc; }
    public void setNgayHieuLuc(LocalDate ngayHieuLuc) { this.ngayHieuLuc = ngayHieuLuc; }

    public LocalDate getNgayHetHan() { return ngayHetHan; }
    public void setNgayHetHan(LocalDate ngayHetHan) { this.ngayHetHan = ngayHetHan; }

    public BigDecimal getLuongCoBan() { return luongCoBan; }
    public void setLuongCoBan(BigDecimal luongCoBan) { this.luongCoBan = luongCoBan; }

    public BigDecimal getLuongDongBhxh() { return luongDongBhxh; }
    public void setLuongDongBhxh(BigDecimal luongDongBhxh) { this.luongDongBhxh = luongDongBhxh; }

    public String getFileDinhKem() { return fileDinhKem; }
    public void setFileDinhKem(String fileDinhKem) { this.fileDinhKem = fileDinhKem; }
}
