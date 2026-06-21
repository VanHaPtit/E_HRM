package QLNV.Controller;

import QLNV.Entity.WorkShift;
import QLNV.Service.WorkShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calamviec")
@CrossOrigin(origins = "*")
public class ShiftController {

    @Autowired
    private WorkShiftService service;

    @GetMapping("/all")
    public List<WorkShift> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public WorkShift getById(@PathVariable Long id) {
        return service.getById(id).orElse(null);
    }

    @PostMapping("/add")
    public WorkShift add(@RequestBody WorkShift caLamViec) {
        return service.save(caLamViec);
    }

    @PutMapping("/update/{id}")
    public WorkShift update(@PathVariable Long id, @RequestBody WorkShift caLamViec) {
        return service.update(id, caLamViec);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Đã xoá ca làm việc có id = " + id;
    }
}

