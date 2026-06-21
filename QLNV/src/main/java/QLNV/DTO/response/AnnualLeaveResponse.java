package QLNV.DTO.response;

public class AnnualLeaveResponse {
    private Long id;
    private Long nhanVienId;
    private String tenNhanVien;
    private String maNv;
    private Integer nam;
    private Float tongPhepDuocCap;
    private Float phepDaNghi;
    private Float phepTonNamTruoc;

    public AnnualLeaveResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public String getTenNhanVien() { return tenNhanVien; }
    public void setTenNhanVien(String tenNhanVien) { this.tenNhanVien = tenNhanVien; }

    public String getMaNv() { return maNv; }
    public void setMaNv(String maNv) { this.maNv = maNv; }

    public Integer getNam() { return nam; }
    public void setNam(Integer nam) { this.nam = nam; }

    public Float getTongPhepDuocCap() { return tongPhepDuocCap; }
    public void setTongPhepDuocCap(Float tongPhepDuocCap) { this.tongPhepDuocCap = tongPhepDuocCap; }

    public Float getPhepDaNghi() { return phepDaNghi; }
    public void setPhepDaNghi(Float phepDaNghi) { this.phepDaNghi = phepDaNghi; }

    public Float getPhepTonNamTruoc() { return phepTonNamTruoc; }
    public void setPhepTonNamTruoc(Float phepTonNamTruoc) { this.phepTonNamTruoc = phepTonNamTruoc; }
}
