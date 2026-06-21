package QLNV.Controller;

import QLNV.DTO.request.DependentRequest;
import QLNV.DTO.response.DependentResponse;
import QLNV.Service.DependentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nguoi-phu-thuoc")
@CrossOrigin("*")
public class DependentController {

    private final DependentService service;

    public DependentController(DependentService service) {
        this.service = service;
    }

    @GetMapping
    public List<DependentResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public DependentResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public DependentResponse create(@RequestBody DependentRequest data) {
        return service.create(data);
    }

    @PutMapping("/{id}")
    public DependentResponse update(@PathVariable Long id, @RequestBody DependentRequest data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/nhan-vien/{nvId}")
    public List<DependentResponse> findByNhanVien(@PathVariable Long nvId) {
        return service.findByNhanVien(nvId);
    }

    @GetMapping("/mst/{mst}")
    public List<DependentResponse> findByMST(@PathVariable String mst) {
        return service.findByMaSoThue(mst);
    }
}
