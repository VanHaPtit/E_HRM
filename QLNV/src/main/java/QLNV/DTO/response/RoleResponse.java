package QLNV.DTO.response;

public class RoleResponse {
    private Long id;
    private String tenRole;

    public RoleResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTenRole() { return tenRole; }
    public void setTenRole(String tenRole) { this.tenRole = tenRole; }
}
