package QLNV.Controller;

import QLNV.Entity.LeaveRequest;
import QLNV.Entity.Enum.RequestStatus;
import QLNV.Service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/don-xin-phep")
@CrossOrigin("*")
public class LeaveRequestController {

    private final LeaveRequestService service;

    public LeaveRequestController(LeaveRequestService service) {
        this.service = service;
    }

    private boolean isAdminOrHR() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("HR"));
    }

    private Long getCurrentNhanVienId() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof QLNV.Service.impl.UserDetailsImpl) {
            return ((QLNV.Service.impl.UserDetailsImpl) auth.getPrincipal()).getNhanVienId();
        }
        return null;
    }

    @GetMapping
    public List<LeaveRequest> getAll() {
        if (isAdminOrHR()) {
            return service.getAll();
        } else {
            Long nvId = getCurrentNhanVienId();
            if (nvId != null) {
                return service.findByNhanVien(nvId);
            }
            return List.of();
        }
    }

    @GetMapping("/{id}")
    public LeaveRequest getById(@PathVariable Long id) {
        LeaveRequest req = service.getById(id);
        if (req != null && !isAdminOrHR()) {
            Long nvId = getCurrentNhanVienId();
            if (nvId == null || !nvId.equals(req.getNhanVien().getId())) {
                throw new RuntimeException("Bạn không có quyền xem đơn này");
            }
        }
        return req;
    }

    @PostMapping
    public LeaveRequest create(@Valid @RequestBody LeaveRequest data) {
        if (!isAdminOrHR()) {
            Long nvId = getCurrentNhanVienId();
            if (nvId == null || !nvId.equals(data.getNhanVien().getId())) {
                throw new RuntimeException("Bạn không thể tạo đơn cho người khác");
            }
        }
        return service.create(data);
    }

    @PutMapping("/{id}")
    public LeaveRequest update(@PathVariable Long id, @Valid @RequestBody LeaveRequest data) {
        LeaveRequest existing = service.getById(id);
        if (existing != null && !isAdminOrHR()) {
            Long nvId = getCurrentNhanVienId();
            if (nvId == null || !nvId.equals(existing.getNhanVien().getId())) {
                throw new RuntimeException("Bạn không có quyền sửa đơn này");
            }
        }
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        LeaveRequest existing = service.getById(id);
        if (existing != null && !isAdminOrHR()) {
            Long nvId = getCurrentNhanVienId();
            if (nvId == null || !nvId.equals(existing.getNhanVien().getId())) {
                throw new RuntimeException("Bạn không có quyền xóa đơn này");
            }
        }
        service.delete(id);
    }

    // --- Filter ---
    @GetMapping("/nhan-vien/{nvId}")
    public List<LeaveRequest> findByNhanVien(@PathVariable Long nvId) {
        if (!isAdminOrHR()) {
            Long currentNvId = getCurrentNhanVienId();
            if (currentNvId == null || !currentNvId.equals(nvId)) {
                throw new RuntimeException("Bạn không có quyền xem đơn của người khác");
            }
        }
        return service.findByNhanVien(nvId);
    }

    @GetMapping("/trang-thai/{status}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public List<LeaveRequest> findByTrangThai(@PathVariable RequestStatus status) {
        return service.findByTrangThai(status);
    }

    // --- Duyệt đơn ---
    @PutMapping("/{id}/approve/{nguoiDuyetId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public LeaveRequest approve(@PathVariable Long id, @PathVariable Long nguoiDuyetId) {
        return service.approveDon(id, nguoiDuyetId);
    }

    @PutMapping("/{id}/reject/{nguoiDuyetId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public LeaveRequest reject(@PathVariable Long id, @PathVariable Long nguoiDuyetId) {
        return service.rejectDon(id, nguoiDuyetId);
    }
}
