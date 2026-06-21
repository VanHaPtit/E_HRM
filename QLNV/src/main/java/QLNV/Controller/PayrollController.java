package QLNV.Controller;

import QLNV.DTO.response.ApiResponse;
import QLNV.DTO.response.PayrollResponse;
import QLNV.Entity.MonthlyPayroll;
import QLNV.Service.MonthlyPayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bangluong")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private MonthlyPayrollService service;

    @GetMapping("/all")
    public ApiResponse<List<PayrollResponse>> getAll() {
        return ApiResponse.success(service.getAll());
    }


    @PostMapping("/calculate")
    public ApiResponse<PayrollResponse> calculateSalary(
            @RequestParam Long nvId,
            @RequestParam Integer thang,
            @RequestParam Integer nam) {
        PayrollResponse result = service.calculateMonthlySalary(nvId, thang, nam);
        return ApiResponse.success(result);
    }

    @GetMapping("/{id}")
    public ApiResponse<PayrollResponse> getById(@PathVariable Long id) {
        Optional<PayrollResponse> payrollOpt = service.getById(id);
        if (payrollOpt.isPresent()) {
            PayrollResponse data = payrollOpt.get();
            return ApiResponse.success(data);
        } else {
            return ApiResponse.error(404, "Không tìm thấy bản ghi lương ID: " + id);
        }
    }

    @PostMapping("/create")
    public ApiResponse<PayrollResponse> create(@RequestBody MonthlyPayroll data) {
        return ApiResponse.success(service.save(data));
    }

    @PutMapping("/update/{id}")
    public ApiResponse<PayrollResponse> update(@PathVariable Long id, @RequestBody MonthlyPayroll data) {
        return ApiResponse.success(service.update(id, data));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.success("Đã xóa bảng lương thành công!");
    }

    @PostMapping("/upload")
    public ApiResponse<String> importExcel(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) return ApiResponse.error(400, "Vui lòng chọn file Excel!");
        service.importFromExcel(file);
        return ApiResponse.success("Import dữ liệu bảng lương thành công!");
    }

    @GetMapping("/filter")
    public ApiResponse<List<PayrollResponse>> filter(
            @RequestParam(required = false) Long nvId,
            @RequestParam Integer thang,
            @RequestParam Integer nam
    ) {
        List<PayrollResponse> result = service.findByNhanVienAndThangNam(nvId, thang, nam);
        return ApiResponse.success(result);
    }
}