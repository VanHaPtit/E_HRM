package QLNV.Service.impl;

import QLNV.DTO.mapper.AttendanceDetailMapper;
import QLNV.DTO.request.AttendanceDetailRequest;
import QLNV.DTO.response.AttendanceDetailResponse;
import QLNV.Entity.AttendanceDetail;
import QLNV.Entity.AttendanceSession;
import QLNV.Repository.AttendanceDetailRepository;
import QLNV.Repository.EmployeeRepository;
import QLNV.Repository.AttendanceSessionRepository;
import QLNV.Service.AttendanceDetailService;
import QLNV.Service.AllowedIpService;
import QLNV.Service.QRCodeGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceDetailServiceImpl implements AttendanceDetailService {

    @Autowired
    private AttendanceDetailRepository repository;

    @Autowired
    private AttendanceSessionRepository phienRepository;

    @Autowired
    private EmployeeRepository nhanVienRepository;

    @Autowired
    private QRCodeGeneratorService qrService;

    @Autowired
    private AllowedIpService allowedIpService;

    @Autowired
    private QLNV.Repository.SystemConfigRepository configRepo;

    @Autowired
    private AttendanceDetailMapper mapper;

    @Override
    public List<AttendanceDetailResponse> findAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceDetailResponse findById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElse(null);
    }

    @Override
    public AttendanceDetailResponse save(AttendanceDetailRequest request) {
        AttendanceDetail entity = mapper.toEntity(request);
        AttendanceDetail saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AttendanceDetailResponse quetMaDiemDanh(Long nhanVienId, String token, String ipAddress) {
        if (!allowedIpService.isIpAllowed(ipAddress)) {
            throw new RuntimeException("Bạn phải kết nối vào mạng nội bộ của công ty để chấm công! (IP của bạn: " + ipAddress + ")");
        }

        if (token != null) token = token.replace(" ", "+");
        if (!qrService.isValidToken(token)) {
            throw new RuntimeException("Mã QR đã hết hạn hoặc không hợp lệ!");
        }

        AttendanceSession phien = phienRepository.findTopByDangHoatDongTrueOrderByNgayTaoDesc()
                .orElseThrow(() -> new RuntimeException("Không có phiên điểm danh nào mở!"));

        LocalDate homNay = LocalDate.now();
        LocalTime bayGio = LocalTime.now();

        List<AttendanceDetail> existingRecords = repository.findByNhanVien_IdAndNgay(nhanVienId, homNay);
        AttendanceDetail record;

        // Tìm bản ghi cuối cùng trong ngày (nếu có)
        AttendanceDetail lastRecord = existingRecords.isEmpty() ? null : existingRecords.get(existingRecords.size() - 1);

        QLNV.Entity.SystemConfig config = configRepo.findTopByOrderByIdAsc();
        LocalTime gioVaoQuyDinh = (config != null && config.getGioVaoLam() != null) ? config.getGioVaoLam() : (phien.getGioBatDauCauHinh() != null ? phien.getGioBatDauCauHinh() : LocalTime.of(8, 0));
        LocalTime gioRaQuyDinh = (config != null && config.getGioRaLam() != null) ? config.getGioRaLam() : (phien.getGioKetThucCauHinh() != null ? phien.getGioKetThucCauHinh() : LocalTime.of(17, 30));

        if (lastRecord == null || lastRecord.getGioCheckOut() != null) {
            // Chưa có bản ghi nào, hoặc bản ghi cuối đã check-out -> Tạo mới (Check-in)
            record = new AttendanceDetail();
            record.setNhanVien(nhanVienRepository.findById(nhanVienId).orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy nhân viên!")));
            record.setPhienDiemDanh(phien);
            record.setNgay(homNay);
            record.setGioCheckIn(bayGio);
            record.setLoaiNgay(phien.getLoaiNgay());
            record.setCongThuong(1.0f);

            if (bayGio.isAfter(gioVaoQuyDinh)) {
                long tre = Duration.between(gioVaoQuyDinh, bayGio).toMinutes();
                record.setSoPhutDiTre((int) tre);
            } else {
                record.setSoPhutDiTre(0);
            }
        } else {
            // Có bản ghi chưa check-out -> Thực hiện Check-out
            record = lastRecord;
            record.setGioCheckOut(bayGio);
            record.setPhienDiemDanh(phien);

            if (bayGio.isBefore(gioRaQuyDinh)) {
                long som = Duration.between(bayGio, gioRaQuyDinh).toMinutes();
                record.setSoPhutVeSom((int) som);
            } else {
                record.setSoPhutVeSom(0);
                float ot = (float) Duration.between(gioRaQuyDinh, bayGio).toHours();
                record.setGioTangCa(ot > 0 ? ot : 0);
            }
        }

        AttendanceDetail savedEntity = repository.save(record);
        return mapper.toResponse(savedEntity);
    }

    @Override
    @Transactional
    public AttendanceDetailResponse diemDanhBangIp(Long nhanVienId, String ipAddress) {
        if (!allowedIpService.isIpAllowed(ipAddress)) {
            throw new RuntimeException("Bạn phải kết nối vào mạng nội bộ của công ty để chấm công! (IP của bạn: " + ipAddress + ")");
        }

        AttendanceSession phien = phienRepository.findTopByDangHoatDongTrueOrderByNgayTaoDesc()
                .orElseThrow(() -> new RuntimeException("Không có phiên điểm danh nào mở!"));

        LocalDate homNay = LocalDate.now();
        LocalTime bayGio = LocalTime.now();

        List<AttendanceDetail> existingRecords = repository.findByNhanVien_IdAndNgay(nhanVienId, homNay);
        AttendanceDetail record;

        // Tìm bản ghi cuối cùng trong ngày (nếu có)
        AttendanceDetail lastRecord = existingRecords.isEmpty() ? null : existingRecords.get(existingRecords.size() - 1);

        QLNV.Entity.SystemConfig config = configRepo.findTopByOrderByIdAsc();
        LocalTime gioVaoQuyDinh = (config != null && config.getGioVaoLam() != null) ? config.getGioVaoLam() : (phien.getGioBatDauCauHinh() != null ? phien.getGioBatDauCauHinh() : LocalTime.of(8, 0));
        LocalTime gioRaQuyDinh = (config != null && config.getGioRaLam() != null) ? config.getGioRaLam() : (phien.getGioKetThucCauHinh() != null ? phien.getGioKetThucCauHinh() : LocalTime.of(17, 30));

        if (lastRecord == null || lastRecord.getGioCheckOut() != null) {
            // Chưa có bản ghi nào, hoặc bản ghi cuối đã check-out -> Tạo mới (Check-in)
            record = new AttendanceDetail();
            record.setNhanVien(nhanVienRepository.findById(nhanVienId).orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy nhân viên!")));
            record.setPhienDiemDanh(phien);
            record.setNgay(homNay);
            record.setGioCheckIn(bayGio);
            record.setLoaiNgay(phien.getLoaiNgay());
            record.setCongThuong(1.0f);

            if (bayGio.isAfter(gioVaoQuyDinh)) {
                long tre = Duration.between(gioVaoQuyDinh, bayGio).toMinutes();
                record.setSoPhutDiTre((int) tre);
            } else {
                record.setSoPhutDiTre(0);
            }
        } else {
            // Có bản ghi chưa check-out -> Thực hiện Check-out
            record = lastRecord;
            record.setGioCheckOut(bayGio);
            record.setPhienDiemDanh(phien);

            if (bayGio.isBefore(gioRaQuyDinh)) {
                long som = Duration.between(bayGio, gioRaQuyDinh).toMinutes();
                record.setSoPhutVeSom((int) som);
            } else {
                record.setSoPhutVeSom(0);
                float ot = (float) Duration.between(gioRaQuyDinh, bayGio).toHours();
                record.setGioTangCa(ot > 0 ? ot : 0);
            }
        }

        AttendanceDetail savedEntity = repository.save(record);
        return mapper.toResponse(savedEntity);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<AttendanceDetailResponse> findByNhanVienId(Long nhanVienId) {
        return repository.findByNhanVien_Id(nhanVienId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceDetailResponse update(Long id, AttendanceDetailRequest request) {
        AttendanceDetail existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi chấm công ID: " + id));

        if (request.getNhanVienId() != null) {
            existing.setNhanVien(nhanVienRepository.findById(request.getNhanVienId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy nhân viên")));
        }

        if (request.getPhienDiemDanhId() != null) {
            existing.setPhienDiemDanh(phienRepository.findById(request.getPhienDiemDanhId())
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy phiên điểm danh")));
        }

        existing.setNgay(request.getNgay());
        existing.setGioCheckIn(request.getGioCheckIn());
        existing.setGioCheckOut(request.getGioCheckOut());
        existing.setSoPhutDiTre(request.getSoPhutDiTre());
        existing.setSoPhutVeSom(request.getSoPhutVeSom());
        existing.setCongThuong(request.getCongThuong());
        existing.setGioTangCa(request.getGioTangCa());

        if (request.getLoaiNgay() != null) {
            existing.setLoaiNgay(QLNV.Entity.Enum.DayType.valueOf(request.getLoaiNgay()));
        }

        return mapper.toResponse(repository.save(existing));
    }
}
