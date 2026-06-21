package QLNV.Controller;

import QLNV.DTO.response.ApiResponse;
import QLNV.DTO.response.AttendanceDetailResponse;
import QLNV.Entity.AttendanceDetail;
import QLNV.Entity.AttendanceSession;
import QLNV.Repository.AttendanceSessionRepository;
import QLNV.Service.AttendanceDetailService;
import QLNV.Service.QRCodeGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin("*")
public class AttendanceSessionController {
    @Autowired
    private AttendanceSessionRepository phienRepo;
    @Autowired private QRCodeGeneratorService qrService;

    @Autowired
    private AttendanceDetailService chamCongService;

    @PostMapping("/start")
    public ResponseEntity<?> startSession(@RequestBody AttendanceSession config) {

        phienRepo.findAll().forEach(p -> { p.setDangHoatDong(false); phienRepo.save(p); });

        config.setNgayTao(LocalDate.now());
        config.setDangHoatDong(true);
        return ResponseEntity.ok(phienRepo.save(config));
    }

    @GetMapping("/get-qr")
    public ResponseEntity<String> getDynamicQR() throws Exception {
        return ResponseEntity.ok(qrService.getQRCodeBase64());
    }

}