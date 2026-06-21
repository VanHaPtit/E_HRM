package QLNV.DTO.request;

import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class PositionRequest {
    @NotBlank(message = "Tên chức vụ không được để trống")
    @Size(max = 50, message = "Tên chức vụ tối đa 50 ký tự")
    private String tenChucVu;
    
    @PositiveOrZero(message = "Cấp bậc phải lớn hơn hoặc bằng 0")
    private Integer capBac;

    public PositionRequest() {}

    public String getTenChucVu() {
        return tenChucVu;
    }

    public void setTenChucVu(String tenChucVu) {
        this.tenChucVu = tenChucVu;
    }

    public Integer getCapBac() {
        return capBac;
    }

    public void setCapBac(Integer capBac) {
        this.capBac = capBac;
    }
}
