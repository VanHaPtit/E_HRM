package QLNV.Entity;

import QLNV.Entity.Enum.LeaveType;
import QLNV.Entity.Enum.RequestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.AssertTrue;

import java.time.LocalDateTime;

@Entity
@Table(name = "don_xin_phep")
public class LeaveRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private Employee nhanVien;

    @NotNull(message = "Từ ngày không được để trống")
    private LocalDateTime tuNgay;
    
    @NotNull(message = "Đến ngày không được để trống")
    private LocalDateTime denNgay;

    @NotNull(message = "Loại nghỉ không được để trống")
    @Enumerated(EnumType.STRING)
    private LeaveType loaiNghi;

    @Enumerated(EnumType.STRING)
    private RequestStatus trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_duyet_id")
    private Employee nguoiDuyet;

    public LeaveRequest(Long id, Employee nhanVien, LocalDateTime tuNgay, LocalDateTime denNgay, LeaveType loaiNghi, RequestStatus trangThai, Employee nguoiDuyet) {
        this.id = id;
        this.nhanVien = nhanVien;
        this.tuNgay = tuNgay;
        this.denNgay = denNgay;
        this.loaiNghi = loaiNghi;
        this.trangThai = trangThai;
        this.nguoiDuyet = nguoiDuyet;
    }

    public LeaveRequest() {
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

    public LocalDateTime getTuNgay() {
        return tuNgay;
    }

    public void setTuNgay(LocalDateTime tuNgay) {
        this.tuNgay = tuNgay;
    }

    public LocalDateTime getDenNgay() {
        return denNgay;
    }

    public void setDenNgay(LocalDateTime denNgay) {
        this.denNgay = denNgay;
    }

    public LeaveType getLoaiNghi() {
        return loaiNghi;
    }

    public void setLoaiNghi(LeaveType loaiNghi) {
        this.loaiNghi = loaiNghi;
    }

    public RequestStatus getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(RequestStatus trangThai) {
        this.trangThai = trangThai;
    }

    public Employee getNguoiDuyet() {
        return nguoiDuyet;
    }

    public void setNguoiDuyet(Employee nguoiDuyet) {
        this.nguoiDuyet = nguoiDuyet;
    }

    @AssertTrue(message = "Thời gian bắt đầu nghỉ phải nhỏ hơn thời gian kết thúc")
    public boolean isValidTime() {
        if (tuNgay == null || denNgay == null) return true;
        return tuNgay.isBefore(denNgay);
    }
}

