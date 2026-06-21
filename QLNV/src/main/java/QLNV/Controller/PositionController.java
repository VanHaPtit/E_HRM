package QLNV.Controller;

import QLNV.DTO.request.PositionRequest;
import QLNV.DTO.response.PositionResponse;
import QLNV.Service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chucvu")
@CrossOrigin(origins = "*")
public class PositionController {

    @Autowired
    private PositionService chucVuService;

    @GetMapping("/list")
    public List<PositionResponse> getAll() {
        return chucVuService.getAll();
    }

    @GetMapping("/{id}")
    public PositionResponse getById(@PathVariable Long id) {
        return chucVuService.getChucVu(id);
    }

    @PostMapping("/create")
    public PositionResponse create(@RequestBody PositionRequest request) {
        return chucVuService.saveChucVu(request);
    }

    @PutMapping("/update/{id}")
    public PositionResponse update(@PathVariable Long id, @RequestBody PositionRequest request) {
        return chucVuService.updateChucVu(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        chucVuService.deleteChucVu(id);
        return "Deleted ID: " + id;
    }

    @GetMapping("/search")
    public List<PositionResponse> search(@RequestParam String keyword) {
        return chucVuService.searchChucVu(keyword);
    }
}
