package QLNV.Entity;

import QLNV.Entity.Enum.DayType;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "cham_cong_chi_tiet")
public class AttendanceDetail {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private Employee nhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phien_diem_danh_id")
    private AttendanceSession phienDiemDanh;

    private LocalDate ngay;

    private LocalTime  gioCheckIn;
    private LocalTime gioCheckOut;

    private Integer soPhutDiTre;
    private Integer soPhutVeSom;

    private Float congThuong;
    private Float gioTangCa;

    @Enumerated(EnumType.STRING)
    private DayType loaiNgay;

    public AttendanceDetail() {
    }

    public AttendanceDetail(Long id, Employee nhanVien, LocalDate ngay, LocalTime  gioCheckIn, LocalTime  gioCheckOut, Integer soPhutDiTre, Integer soPhutVeSom, Float congThuong, Float gioTangCa, DayType loaiNgay) {
        this.id = id;
        this.nhanVien = nhanVien;
        this.ngay = ngay;
        this.gioCheckIn = gioCheckIn;
        this.gioCheckOut = gioCheckOut;
        this.soPhutDiTre = soPhutDiTre;
        this.soPhutVeSom = soPhutVeSom;
        this.congThuong = congThuong;
        this.gioTangCa = gioTangCa;
        this.loaiNgay = loaiNgay;
    }

    public LocalDate getNgay() {
        return ngay;
    }

    public void setNgay(LocalDate ngay) {
        this.ngay = ngay;
    }

    public LocalTime getGioCheckIn() {
        return gioCheckIn;
    }

    public void setGioCheckIn(LocalTime gioCheckIn) {
        this.gioCheckIn = gioCheckIn;
    }

    public LocalTime getGioCheckOut() {
        return gioCheckOut;
    }

    public void setGioCheckOut(LocalTime gioCheckOut) {
        this.gioCheckOut = gioCheckOut;
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


    public Integer getSoPhutDiTre() {
        return soPhutDiTre;
    }

    public void setSoPhutDiTre(Integer soPhutDiTre) {
        this.soPhutDiTre = soPhutDiTre;
    }

    public Integer getSoPhutVeSom() {
        return soPhutVeSom;
    }

    public void setSoPhutVeSom(Integer soPhutVeSom) {
        this.soPhutVeSom = soPhutVeSom;
    }

    public Float getCongThuong() {
        return congThuong;
    }

    public void setCongThuong(Float congThuong) {
        this.congThuong = congThuong;
    }

    public Float getGioTangCa() {
        return gioTangCa;
    }

    public void setGioTangCa(Float gioTangCa) {
        this.gioTangCa = gioTangCa;
    }

    public DayType getLoaiNgay() {
        return loaiNgay;
    }

    public void setLoaiNgay(DayType loaiNgay) {
        this.loaiNgay = loaiNgay;
    }

    public AttendanceSession getPhienDiemDanh() {
        return phienDiemDanh;
    }

    public void setPhienDiemDanh(AttendanceSession phienDiemDanh) {
        this.phienDiemDanh = phienDiemDanh;
    }
}

