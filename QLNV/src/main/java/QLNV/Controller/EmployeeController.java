package QLNV.Controller;

import QLNV.DTO.request.EmployeeRequest;
import QLNV.DTO.request.EmailRequest;
import QLNV.DTO.response.EmployeeResponse;
import QLNV.DTO.response.ApiResponse;
import QLNV.Service.EmployeeService;
import QLNV.Service.SendGridMailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestController
@RequestMapping("/api/nhanvien")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Validator validator;

    @Autowired
    private SendGridMailService mailService;

    @GetMapping("/all")
    public ResponseEntity<List<EmployeeResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getById(@PathVariable Long id) {
        Optional<EmployeeResponse> nvOpt = service.getById(id);

        if (nvOpt.isPresent()) {
            return ResponseEntity.ok(nvOpt.get());
        } else {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> add(
            @RequestPart("nhanVien") String nhanVienJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        EmployeeRequest req = objectMapper.readValue(nhanVienJson, EmployeeRequest.class);
        Set<ConstraintViolation<EmployeeRequest>> violations = validator.validate(req);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        
        EmployeeResponse savedNv = service.save(req, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNv);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("nhanVien") String nhanVienJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {
        EmployeeRequest req = objectMapper.readValue(nhanVienJson, EmployeeRequest.class);
        Set<ConstraintViolation<EmployeeRequest>> violations = validator.validate(req);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        
        EmployeeResponse updatedNv = service.update(id, req, file);
        return ResponseEntity.ok(updatedNv);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Đã xoá nhân viên có ID = " + id);
    }

    @GetMapping("/search/{maNv}")
    public ResponseEntity<EmployeeResponse> findByMaNv(@PathVariable String maNv) {
        EmployeeResponse nv = service.findByMaNv(maNv);
        return nv != null ? ResponseEntity.ok(nv) : ResponseEntity.notFound().build();
    }

    @PostMapping("/send-email")
    public ResponseEntity<ApiResponse<String>> sendEmail(@jakarta.validation.Valid @RequestBody EmailRequest request) {
        try {
            mailService.sendMail(request);
            return ResponseEntity.ok(ApiResponse.success("Gửi email thành công!"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(ApiResponse.error(500, "Lỗi khi gửi email: " + e.getMessage()));
        }
    }
}