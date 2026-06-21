package QLNV.DTO.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

public class AnnualLeaveRequest {
    @NotNull(message = "ID nhân viên không được để trống")
    private Long nhanVienId;

    @NotNull(message = "Năm không được để trống")
    @Min(value = 2000, message = "Năm không hợp lệ")
    private Integer nam;
    
    @PositiveOrZero(message = "Tổng phép được cấp không được âm")
    private Float tongPhepDuocCap;
    
    @PositiveOrZero(message = "Số phép đã nghỉ không được âm")
    private Float phepDaNghi;
    
    @PositiveOrZero(message = "Số phép tồn năm trước không được âm")
    private Float phepTonNamTruoc;

    public AnnualLeaveRequest() {}

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public Integer getNam() { return nam; }
    public void setNam(Integer nam) { this.nam = nam; }

    public Float getTongPhepDuocCap() { return tongPhepDuocCap; }
    public void setTongPhepDuocCap(Float tongPhepDuocCap) { this.tongPhepDuocCap = tongPhepDuocCap; }

    public Float getPhepDaNghi() { return phepDaNghi; }
    public void setPhepDaNghi(Float phepDaNghi) { this.phepDaNghi = phepDaNghi; }

    public Float getPhepTonNamTruoc() { return phepTonNamTruoc; }
    public void setPhepTonNamTruoc(Float phepTonNamTruoc) { this.phepTonNamTruoc = phepTonNamTruoc; }
}
