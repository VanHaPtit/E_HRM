package QLNV.DTO.request;

import jakarta.validation.constraints.NotBlank;

public class RoleRequest {
    @NotBlank(message = "Tên quyền không được để trống")
    private String tenRole;

    public RoleRequest() {}

    public String getTenRole() { return tenRole; }
    public void setTenRole(String tenRole) { this.tenRole = tenRole; }
}
