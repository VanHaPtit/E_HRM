package QLNV.DTO.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String hoTenNhanVien;
    private String roleName;
}
