package QLNV.Controller;

import QLNV.DTO.request.DepartmentRequest;
import QLNV.DTO.response.DepartmentResponse;
import QLNV.Service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/phongban")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService phongBanService;

    @GetMapping("/list")
    public List<DepartmentResponse> getPhongBanList() {
        return phongBanService.getAll();
    }

    @GetMapping("/{id}")
    public DepartmentResponse getById(@PathVariable Long id) {
        return phongBanService.getPhongBan(id);
    }

    @PostMapping("/create")
    public DepartmentResponse create(@Valid @RequestBody DepartmentRequest request) {
        return phongBanService.savePhongBan(request);
    }

    @PutMapping("/update/{id}")
    public DepartmentResponse update(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        return phongBanService.updatePhongBan(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        phongBanService.deletePhongBan(id);
        return "Deleted ID: " + id;
    }

    @GetMapping("/search")
    public List<DepartmentResponse> search(@RequestParam String keyword) {
        return phongBanService.searchPhongBan(keyword);
    }
}


