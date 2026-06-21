package QLNV.Controller;

import QLNV.Entity.WorkHistory;
import QLNV.Service.WorkHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qua-trinh-cong-tac")
@CrossOrigin(origins = "*")
public class WorkHistoryController {

    private final WorkHistoryService service;

    public WorkHistoryController(WorkHistoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<WorkHistory> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public WorkHistory getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public WorkHistory create(@RequestBody WorkHistory qtct) {
        return service.create(qtct);
    }

    @PutMapping("/{id}")
    public WorkHistory update(@PathVariable Long id, @RequestBody WorkHistory qtct) {
        return service.update(id, qtct);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/nhan-vien/{nvId}")
    public List<WorkHistory> findByNhanVien(@PathVariable Long nvId) {
        return service.findByNhanVien(nvId);
    }
}
