package QLNV.Controller;

import QLNV.DTO.request.EmployeeAllowanceRequest;
import QLNV.DTO.response.EmployeeAllowanceResponse;
import QLNV.Service.EmployeeAllowanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phu-cap-nhan-vien")
@CrossOrigin(origins = "*")
public class EmployeeAllowanceController {

    private final EmployeeAllowanceService service;

    public EmployeeAllowanceController(EmployeeAllowanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<EmployeeAllowanceResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EmployeeAllowanceResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public EmployeeAllowanceResponse create(@RequestBody EmployeeAllowanceRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EmployeeAllowanceResponse update(@PathVariable Long id, @RequestBody EmployeeAllowanceRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/hop-dong/{hopDongId}")
    public List<EmployeeAllowanceResponse> findByHopDong(@PathVariable Long hopDongId) {
        return service.findByHopDong(hopDongId);
    }

    @GetMapping("/phu-cap/{phuCapId}")
    public List<EmployeeAllowanceResponse> findByPhuCap(@PathVariable Long phuCapId) {
        return service.findByPhuCap(phuCapId);
    }
}
