package QLNV.DTO.response;

import java.time.LocalDateTime;

public class LeaveResponseDTO {
    private Long id;
    private Long nhanVienId;
    private String tenNhanVien;
    private LocalDateTime tuNgay;
    private LocalDateTime denNgay;
    private String loaiNghi;
    private String trangThai;
    private Long nguoiDuyetId;
    private String tenNguoiDuyet;

    public LeaveResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public String getTenNhanVien() { return tenNhanVien; }
    public void setTenNhanVien(String tenNhanVien) { this.tenNhanVien = tenNhanVien; }

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

    public String getTenNguoiDuyet() { return tenNguoiDuyet; }
    public void setTenNguoiDuyet(String tenNguoiDuyet) { this.tenNguoiDuyet = tenNguoiDuyet; }
}
