package QLNV.Entity;

import QLNV.Entity.Enum.DecisionType;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "qua_trinh_cong_tac")
public class WorkHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee nhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phong_ban_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Department phongBan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chuc_vu_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Position chucVu;

    private LocalDate ngayHieuLuc;
    private LocalDate ngayKetThuc;

    @Enumerated(EnumType.STRING)
    private DecisionType loaiQuyetDinh;

    public WorkHistory(Long id, Employee nhanVien, Department phongBan, Position chucVu, LocalDate ngayHieuLuc, LocalDate ngayKetThuc, DecisionType loaiQuyetDinh) {
        this.id = id;
        this.nhanVien = nhanVien;
        this.phongBan = phongBan;
        this.chucVu = chucVu;
        this.ngayHieuLuc = ngayHieuLuc;
        this.ngayKetThuc = ngayKetThuc;
        this.loaiQuyetDinh = loaiQuyetDinh;
    }

    public WorkHistory() {
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

    public Department getPhongBan() {
        return phongBan;
    }

    public void setPhongBan(Department phongBan) {
        this.phongBan = phongBan;
    }

    public Position getChucVu() {
        return chucVu;
    }

    public void setChucVu(Position chucVu) {
        this.chucVu = chucVu;
    }

    public LocalDate getNgayHieuLuc() {
        return ngayHieuLuc;
    }

    public void setNgayHieuLuc(LocalDate ngayHieuLuc) {
        this.ngayHieuLuc = ngayHieuLuc;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public DecisionType getLoaiQuyetDinh() {
        return loaiQuyetDinh;
    }

    public void setLoaiQuyetDinh(DecisionType loaiQuyetDinh) {
        this.loaiQuyetDinh = loaiQuyetDinh;
    }
}

