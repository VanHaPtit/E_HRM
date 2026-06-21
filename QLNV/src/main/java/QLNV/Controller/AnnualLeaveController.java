package QLNV.Controller;

import QLNV.DTO.request.AnnualLeaveRequest;
import QLNV.DTO.response.AnnualLeaveResponse;
import QLNV.Service.QuyPhepNamService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/quy-phep-nam")
@CrossOrigin(origins = "*")
public class AnnualLeaveController {

    private final QuyPhepNamService service;

    public AnnualLeaveController(QuyPhepNamService service) {
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
    public List<AnnualLeaveResponse> getAll() {
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
    public AnnualLeaveResponse getById(@PathVariable Long id) {
        AnnualLeaveResponse res = service.getById(id);
        if (res != null && !isAdminOrHR()) {
            Long nvId = getCurrentNhanVienId();
            if (nvId == null || !nvId.equals(res.getNhanVienId())) {
                throw new RuntimeException("Bạn không có quyền xem thông tin này");
            }
        }
        return res;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public AnnualLeaveResponse create(@RequestBody AnnualLeaveRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public AnnualLeaveResponse update(@PathVariable Long id, @RequestBody AnnualLeaveRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Đã xóa QuyPhepNam id = " + id;
    }

    // Lấy theo năm
    @GetMapping("/nam/{nam}")
    public List<AnnualLeaveResponse> getByYear(@PathVariable Integer nam) {
        if (isAdminOrHR()) {
            return service.findByNam(nam);
        } else {
            Long nvId = getCurrentNhanVienId();
            if (nvId != null) {
                return service.findByNhanVienAndNam(nvId, nam);
            }
            return List.of();
        }
    }

    // Lấy theo nhân viên
    @GetMapping("/nhan-vien/{id}")
    public List<AnnualLeaveResponse> getByEmployee(@PathVariable Long id) {
        if (!isAdminOrHR()) {
            Long currentNvId = getCurrentNhanVienId();
            if (currentNvId == null || !currentNvId.equals(id)) {
                throw new RuntimeException("Bạn không có quyền xem thông tin của người khác");
            }
        }
        return service.findByNhanVien(id);
    }

    // Lấy theo nhân viên + năm
    @GetMapping("/search")
    public List<AnnualLeaveResponse> search(
            @RequestParam Long nhanVienId,
            @RequestParam Integer nam) {
        if (!isAdminOrHR()) {
            Long currentNvId = getCurrentNhanVienId();
            if (currentNvId == null || !currentNvId.equals(nhanVienId)) {
                throw new RuntimeException("Bạn không có quyền xem thông tin của người khác");
            }
        }
        return service.findByNhanVienAndNam(nhanVienId, nam);
    }
}
