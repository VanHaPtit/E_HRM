package QLNV.DTO.request;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class EmployeeAllowanceRequest {
    @NotNull(message = "ID hợp đồng không được để trống")
    private Long hopDongId;

    @NotNull(message = "ID phụ cấp không được để trống")
    private Long phuCapId;

    @NotNull(message = "Số tiền không được để trống")
    @Positive(message = "Số tiền phụ cấp phải lớn hơn 0")
    private BigDecimal soTien;

    public EmployeeAllowanceRequest() {}

    public Long getHopDongId() { return hopDongId; }
    public void setHopDongId(Long hopDongId) { this.hopDongId = hopDongId; }

    public Long getPhuCapId() { return phuCapId; }
    public void setPhuCapId(Long phuCapId) { this.phuCapId = phuCapId; }

    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
}
