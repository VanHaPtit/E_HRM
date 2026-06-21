package QLNV.DTO.response;

import lombok.Data;

@Data
public class AllowedIpResponse {
    private Long id;
    private String ipAddress;
    private String description;
    private boolean active;
}
