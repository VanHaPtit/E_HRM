package QLNV.DTO.response;

import java.math.BigDecimal;

public class EmployeeAllowanceResponse {
    private Long id;
    private Long hopDongId;
    private String soHopDong;
    private Long phuCapId;
    private String tenPhuCap;
    private String tenNhanVien;
    private String maNv;
    private BigDecimal soTien;

    public EmployeeAllowanceResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHopDongId() { return hopDongId; }
    public void setHopDongId(Long hopDongId) { this.hopDongId = hopDongId; }

    public String getSoHopDong() { return soHopDong; }
    public void setSoHopDong(String soHopDong) { this.soHopDong = soHopDong; }

    public Long getPhuCapId() { return phuCapId; }
    public void setPhuCapId(Long phuCapId) { this.phuCapId = phuCapId; }

    public String getTenPhuCap() { return tenPhuCap; }
    public void setTenPhuCap(String tenPhuCap) { this.tenPhuCap = tenPhuCap; }

    public String getTenNhanVien() { return tenNhanVien; }
    public void setTenNhanVien(String tenNhanVien) { this.tenNhanVien = tenNhanVien; }

    public String getMaNv() { return maNv; }
    public void setMaNv(String maNv) { this.maNv = maNv; }

    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
}
