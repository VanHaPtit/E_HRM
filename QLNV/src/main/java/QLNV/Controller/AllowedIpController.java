package QLNV.Controller;

import QLNV.DTO.request.AllowedIpRequest;
import QLNV.DTO.response.ApiResponse;
import QLNV.DTO.response.AllowedIpResponse;
import QLNV.Service.AllowedIpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allowed-ips")
@CrossOrigin("*")
public class AllowedIpController {

    @Autowired
    private AllowedIpService service;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ApiResponse<List<AllowedIpResponse>> getAll() {
        return ApiResponse.success(service.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ApiResponse<AllowedIpResponse> create(@Valid @RequestBody AllowedIpRequest request) {
        return ApiResponse.success(service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ApiResponse<AllowedIpResponse> update(@PathVariable Long id, @Valid @RequestBody AllowedIpRequest request) {
        return ApiResponse.success(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ApiResponse<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.success("Đã xóa IP cấu hình thành công");
    }
}
