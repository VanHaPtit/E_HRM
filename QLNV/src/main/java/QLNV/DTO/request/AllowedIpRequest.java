package QLNV.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AllowedIpRequest {

    @NotBlank(message = "Địa chỉ IP không được để trống")
    @Pattern(regexp = "^([0-9]{1,3}\\.){3}[0-9]{1,3}$|^0:0:0:0:0:0:0:1$", message = "Định dạng IP không hợp lệ")
    private String ipAddress;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    private Boolean active;
}
