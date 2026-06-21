package QLNV.Controller;


import QLNV.DTO.request.AttendanceDetailRequest;
import QLNV.DTO.response.ApiResponse;
import QLNV.DTO.response.AttendanceDetailResponse;
import QLNV.Service.AttendanceDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import QLNV.Util.ClientIpUtil;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/cham-cong-chi-tiet")
@CrossOrigin("*")
public class AttendanceDetailController {

    @Autowired
    private AttendanceDetailService service;

    @GetMapping
    public ApiResponse<List<AttendanceDetailResponse>> getAll() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof QLNV.Service.impl.UserDetailsImpl) {
            QLNV.Service.impl.UserDetailsImpl userDetails = (QLNV.Service.impl.UserDetailsImpl) auth.getPrincipal();
            boolean isAdminOrHR = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("HR"));
            
            if (isAdminOrHR) {
                return ApiResponse.success(service.findAll());
            } else {
                if (userDetails.getNhanVienId() != null) {
                    return ApiResponse.success(service.findByNhanVienId(userDetails.getNhanVienId()));
                } else {
                    return ApiResponse.success(java.util.List.of());
                }
            }
        }
        return ApiResponse.error(401, "Unauthorized");
    }

    @GetMapping("/{id}")
    public ApiResponse<AttendanceDetailResponse> getById(@PathVariable Long id) {
        AttendanceDetailResponse res = service.findById(id);
        if (res == null) {
            return ApiResponse.error(404, "Không tìm thấy bản ghi chấm công ID: " + id);
        }

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof QLNV.Service.impl.UserDetailsImpl) {
            QLNV.Service.impl.UserDetailsImpl userDetails = (QLNV.Service.impl.UserDetailsImpl) auth.getPrincipal();
            boolean isAdminOrHR = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("HR"));

            if (!isAdminOrHR && (userDetails.getNhanVienId() == null || !userDetails.getNhanVienId().equals(res.getNhanVienId()))) {
                return ApiResponse.error(403, "Bạn không có quyền xem bản ghi này");
            }
        }

        return ApiResponse.success(res);
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ResponseEntity<AttendanceDetailResponse> create(@RequestBody AttendanceDetailRequest request) {
        return ResponseEntity.ok(service.save(request));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ApiResponse<AttendanceDetailResponse> update(
            @PathVariable Long id,
            @RequestBody AttendanceDetailRequest data) {
        AttendanceDetailResponse updated = service.update(id, data);
        return ApiResponse.success(updated);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public ApiResponse<String> delete(@PathVariable Long id) {
        AttendanceDetailResponse existing = service.findById(id);
        if (existing == null) {
            return ApiResponse.error(404, "Không có bản ghi để xóa!");
        }
        service.delete(id);
        return ApiResponse.success("Đã xóa bản ghi chấm công thành công!");
    }

    @GetMapping("/nhan-vien/{nhanVienId}")
    public ApiResponse<List<AttendanceDetailResponse>> findByNhanVien(@PathVariable Long nhanVienId) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof QLNV.Service.impl.UserDetailsImpl) {
            QLNV.Service.impl.UserDetailsImpl userDetails = (QLNV.Service.impl.UserDetailsImpl) auth.getPrincipal();
            boolean isAdminOrHR = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("HR"));

            if (!isAdminOrHR && (userDetails.getNhanVienId() == null || !userDetails.getNhanVienId().equals(nhanVienId))) {
                return ApiResponse.error(403, "Bạn không có quyền xem bản ghi của nhân viên khác");
            }
        }

        List<AttendanceDetailResponse> list = service.findByNhanVienId(nhanVienId);
        return ApiResponse.success(list);
    }


    @PostMapping("/scan")
    public ApiResponse<AttendanceDetailResponse> scan(
            @RequestParam Long nhanVienId,
            @RequestParam String token,
            HttpServletRequest request) throws Exception {
        String clientIp = ClientIpUtil.getClientIpAddress(request);
        AttendanceDetailResponse res = service.quetMaDiemDanh(nhanVienId, token, clientIp);
        return ApiResponse.success(res);
    }

    @PostMapping("/ip-checkin")
    public ApiResponse<AttendanceDetailResponse> ipCheckin(
            @RequestParam Long nhanVienId,
            HttpServletRequest request) {
        String clientIp = ClientIpUtil.getClientIpAddress(request);
        AttendanceDetailResponse res = service.diemDanhBangIp(nhanVienId, clientIp);
        return ApiResponse.success(res);
    }

}

