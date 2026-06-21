package QLNV.Entity;

import QLNV.Entity.Enum.DayType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "phien_diem_danh")
@Data
public class AttendanceSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalTime gioBatDauCauHinh;
    private LocalTime gioKetThucCauHinh;
    private LocalDate ngayTao;
    private boolean dangHoatDong;

    @Enumerated(EnumType.STRING)
    private DayType loaiNgay;

    public AttendanceSession() {
    }

    public AttendanceSession(Long id, LocalTime gioBatDauCauHinh, LocalTime gioKetThucCauHinh, LocalDate ngayTao, boolean dangHoatDong, DayType loaiNgay) {
        this.id = id;
        this.gioBatDauCauHinh = gioBatDauCauHinh;
        this.gioKetThucCauHinh = gioKetThucCauHinh;
        this.ngayTao = ngayTao;
        this.dangHoatDong = dangHoatDong;
        this.loaiNgay = loaiNgay;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getGioBatDauCauHinh() {
        return gioBatDauCauHinh;
    }

    public void setGioBatDauCauHinh(LocalTime gioBatDauCauHinh) {
        this.gioBatDauCauHinh = gioBatDauCauHinh;
    }

    public LocalTime getGioKetThucCauHinh() {
        return gioKetThucCauHinh;
    }

    public void setGioKetThucCauHinh(LocalTime gioKetThucCauHinh) {
        this.gioKetThucCauHinh = gioKetThucCauHinh;
    }

    public LocalDate getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDate ngayTao) {
        this.ngayTao = ngayTao;
    }

    public boolean isDangHoatDong() {
        return dangHoatDong;
    }

    public void setDangHoatDong(boolean dangHoatDong) {
        this.dangHoatDong = dangHoatDong;
    }

    public DayType getLoaiNgay() {
        return loaiNgay;
    }

    public void setLoaiNgay(DayType loaiNgay) {
        this.loaiNgay = loaiNgay;
    }
}