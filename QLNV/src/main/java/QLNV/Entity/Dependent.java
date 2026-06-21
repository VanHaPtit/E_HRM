package QLNV.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "nguoi_phu_thuoc")
public class Dependent {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private Employee nhanVien;

    private String hoTenNguoiThan;
    private String quanHe;
    private LocalDate ngaySinh;
    private String maSoThue;

    private LocalDate ngayBatDauGiamTru;
    private LocalDate ngayKetThucGiamTru;

    public Dependent(Long id, Employee nhanVien, String hoTenNguoiThan, String quanHe, LocalDate ngaySinh, String maSoThue, LocalDate ngayBatDauGiamTru, LocalDate ngayKetThucGiamTru) {
        this.id = id;
        this.nhanVien = nhanVien;
        this.hoTenNguoiThan = hoTenNguoiThan;
        this.quanHe = quanHe;
        this.ngaySinh = ngaySinh;
        this.maSoThue = maSoThue;
        this.ngayBatDauGiamTru = ngayBatDauGiamTru;
        this.ngayKetThucGiamTru = ngayKetThucGiamTru;
    }

    public Dependent() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(Employee nhanVien) {
        this.nhanVien = nhanVien;
    }

    public String getHoTenNguoiThan() {
        return hoTenNguoiThan;
    }

    public void setHoTenNguoiThan(String hoTenNguoiThan) {
        this.hoTenNguoiThan = hoTenNguoiThan;
    }

    public String getQuanHe() {
        return quanHe;
    }

    public void setQuanHe(String quanHe) {
        this.quanHe = quanHe;
    }

    public LocalDate getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(LocalDate ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public String getMaSoThue() {
        return maSoThue;
    }

    public void setMaSoThue(String maSoThue) {
        this.maSoThue = maSoThue;
    }

    public LocalDate getNgayBatDauGiamTru() {
        return ngayBatDauGiamTru;
    }

    public void setNgayBatDauGiamTru(LocalDate ngayBatDauGiamTru) {
        this.ngayBatDauGiamTru = ngayBatDauGiamTru;
    }

    public LocalDate getNgayKetThucGiamTru() {
        return ngayKetThucGiamTru;
    }

    public void setNgayKetThucGiamTru(LocalDate ngayKetThucGiamTru) {
        this.ngayKetThucGiamTru = ngayKetThucGiamTru;
    }
}

