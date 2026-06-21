package QLNV.Service;

import QLNV.DTO.request.AllowedIpRequest;
import QLNV.DTO.response.AllowedIpResponse;
import java.util.List;

public interface AllowedIpService {
    List<AllowedIpResponse> getAll();
    AllowedIpResponse create(AllowedIpRequest request);
    AllowedIpResponse update(Long id, AllowedIpRequest request);
    void delete(Long id);
    boolean isIpAllowed(String ipAddress);
}
