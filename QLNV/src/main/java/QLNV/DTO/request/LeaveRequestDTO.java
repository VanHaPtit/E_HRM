package QLNV.DTO.request;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.AssertTrue;

public class LeaveRequestDTO {
    @NotNull(message = "ID nhân viên không được để trống")
    private Long nhanVienId;

    @NotNull(message = "Từ ngày không được để trống")
    private LocalDateTime tuNgay;

    @NotNull(message = "Đến ngày không được để trống")
    private LocalDateTime denNgay;

    @NotBlank(message = "Loại nghỉ không được để trống")
    private String loaiNghi;

    private String trangThai;
    private Long nguoiDuyetId;

    public LeaveRequestDTO() {}

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public LocalDateTime getTuNgay() { return tuNgay; }
    public void setTuNgay(LocalDateTime tuNgay) { this.tuNgay = tuNgay; }

    public LocalDateTime getDenNgay() { return denNgay; }
    public void setDenNgay(LocalDateTime denNgay) { this.denNgay = denNgay; }

    public String getLoaiNghi() { return loaiNghi; }
    public void setLoaiNghi(String loaiNghi) { this.loaiNghi = loaiNghi; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public Long getNguoiDuyetId() { return nguoiDuyetId; }
    public void setNguoiDuyetId(Long nguoiDuyetId) { this.nguoiDuyetId = nguoiDuyetId; }

    @AssertTrue(message = "Thời gian bắt đầu nghỉ phải nhỏ hơn thời gian kết thúc")
    public boolean isValidTime() {
        if (tuNgay == null || denNgay == null) return true;
        return tuNgay.isBefore(denNgay);
    }
}
