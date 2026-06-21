package QLNV.Controller;

import QLNV.Entity.AllowanceConfig;
import QLNV.Service.AllowanceConfigService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phu-cap")
@CrossOrigin("*")
public class AllowanceConfigController {

    private final AllowanceConfigService service;

    public AllowanceConfigController(AllowanceConfigService service) {
        this.service = service;
    }

    @GetMapping
    public List<AllowanceConfig> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public AllowanceConfig getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public AllowanceConfig create(@RequestBody AllowanceConfig phuCap) {
        return service.create(phuCap);
    }

    @PutMapping("/{id}")
    public AllowanceConfig update(@PathVariable Long id, @RequestBody AllowanceConfig phuCap) {
        return service.update(id, phuCap);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
