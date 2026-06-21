package QLNV.DTO.response;

import java.time.LocalDate;

public class DependentResponse {

    private Long id;
    private Long nhanVienId;
    private String tenNhanVien;
    private String maNv;
    private String hoTenNguoiThan;
    private String quanHe;
    private LocalDate ngaySinh;
    private String maSoThue;
    private LocalDate ngayBatDauGiamTru;
    private LocalDate ngayKetThucGiamTru;

    public DependentResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public String getTenNhanVien() { return tenNhanVien; }
    public void setTenNhanVien(String tenNhanVien) { this.tenNhanVien = tenNhanVien; }

    public String getMaNv() { return maNv; }
    public void setMaNv(String maNv) { this.maNv = maNv; }

    public String getHoTenNguoiThan() { return hoTenNguoiThan; }
    public void setHoTenNguoiThan(String hoTenNguoiThan) { this.hoTenNguoiThan = hoTenNguoiThan; }

    public String getQuanHe() { return quanHe; }
    public void setQuanHe(String quanHe) { this.quanHe = quanHe; }

    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getMaSoThue() { return maSoThue; }
    public void setMaSoThue(String maSoThue) { this.maSoThue = maSoThue; }

    public LocalDate getNgayBatDauGiamTru() { return ngayBatDauGiamTru; }
    public void setNgayBatDauGiamTru(LocalDate ngayBatDauGiamTru) { this.ngayBatDauGiamTru = ngayBatDauGiamTru; }

    public LocalDate getNgayKetThucGiamTru() { return ngayKetThucGiamTru; }
    public void setNgayKetThucGiamTru(LocalDate ngayKetThucGiamTru) { this.ngayKetThucGiamTru = ngayKetThucGiamTru; }
}
