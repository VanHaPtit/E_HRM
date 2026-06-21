package QLNV.Service.impl;

import QLNV.DTO.response.PayrollResponse;
import QLNV.Entity.*;
import QLNV.Entity.Enum.DayType;
import QLNV.Repository.*;
import QLNV.Service.MonthlyPayrollService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MonthlyPayrollServiceImpl implements MonthlyPayrollService {

    @Autowired private MonthlyPayrollRepository repo;
    @Autowired private EmployeeRepository nhanVienRepository;
    @Autowired private AttendanceDetailRepository attendanceRepo;
    @Autowired private SystemConfigRepository configRepo;
    @Autowired private TaxBracketRepository taxBracketRepo;
    @Autowired private AnnualLeaveRepository annualLeaveRepo;
    @Autowired private LeaveRequestRepository leaveReqRepo;

    @Override
    public List<PayrollResponse> getAll() {
        List<MonthlyPayroll> payrollList = repo.findAll();

        List<PayrollResponse> responseList = new ArrayList<>();

        for (MonthlyPayroll bl : payrollList) {

            PayrollResponse res = mapToPayrollResponse(bl);

            responseList.add(res);
        }

        return responseList;
    }

    @Override
    public Optional<PayrollResponse> getById(Long id) {

        Optional<MonthlyPayroll> payrollOpt = repo.findById(id);

        if (payrollOpt.isPresent()) {

            MonthlyPayroll bl = payrollOpt.get();
            PayrollResponse res = mapToPayrollResponse(bl);

            return Optional.of(res);
        }

        return Optional.empty();
    }

    @Override
    @Transactional
    public PayrollResponse calculateMonthlySalary(Long nvId, int thang, int nam) {

        SystemConfig config = configRepo.findTopByOrderByIdAsc();
        if (config == null) throw new RuntimeException("Chưa cấu hình SystemConfig!");

        Employee nv = nhanVienRepository.findById(nvId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên ID: " + nvId));
        List<TaxBracket> brackets = taxBracketRepo.findAll();

        LocalDate start = LocalDate.of(nam, thang, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        List<AttendanceDetail> logs = attendanceRepo.findByNhanVien_IdAndNgayBetween(nvId, start, end);


        Optional<MonthlyPayroll> oldPayrollOpt = repo.findByNhanVienIdAndThangAndNam(nvId, thang, nam);

        // 3. Xử lý logic Phép năm (TỰ ĐỘNG LẤY TỪ ĐƠN XIN PHÉP ĐÃ DUYỆT)
        java.time.LocalDateTime startDateTime = start.atStartOfDay();
        java.time.LocalDateTime endDateTime = end.atTime(23, 59, 59);
        List<LeaveRequest> approvedLeaves = leaveReqRepo.findByNhanVien_IdAndTrangThaiAndTuNgayBetween(
                nvId, QLNV.Entity.Enum.RequestStatus.DA_DUYET, startDateTime, endDateTime);

        float tongGioXinNghi = 0f;
        for (LeaveRequest leave : approvedLeaves) {
            if (leave.getTuNgay() != null && leave.getDenNgay() != null) {
                long minutes = java.time.Duration.between(leave.getTuNgay(), leave.getDenNgay()).toMinutes();
                tongGioXinNghi += (minutes / 60.0f);
            }
        }
        
        // Quy đổi số giờ xin nghỉ ra số ngày nghỉ dựa trên số giờ làm việc chuẩn mỗi ngày
        float soNgayXinNghi = tongGioXinNghi / (float) config.getSoGioMotNgay();

        AnnualLeave quyPhep = annualLeaveRepo.findByNhanVienIdAndNam(nvId, nam).orElse(new AnnualLeave());

        // Hoàn trả phép cũ nếu tính lại để tránh trừ âm quỹ phép
        if (oldPayrollOpt.isPresent() && oldPayrollOpt.get().getPhepSuDung() != null) {
            float phepDaDungCu = oldPayrollOpt.get().getPhepSuDung();
            quyPhep.setPhepDaNghi(Math.max(0, safeFloat(quyPhep.getPhepDaNghi()) - phepDaDungCu));
        }

        float phepConLai = (safeFloat(quyPhep.getTongPhepDuocCap()) + safeFloat(quyPhep.getPhepTonNamTruoc())) - safeFloat(quyPhep.getPhepDaNghi());
        float phepSuDungMoi = (phepConLai >= soNgayXinNghi) ? (float)soNgayXinNghi : Math.max(0, phepConLai);
        float ngayNghiKhongPhep = (float)soNgayXinNghi - phepSuDungMoi;

        quyPhep.setPhepDaNghi(safeFloat(quyPhep.getPhepDaNghi()) + phepSuDungMoi);
        annualLeaveRepo.save(quyPhep);

        // 4. SỬ DỤNG 2 HÀM HELPER ĐỂ TÍNH TỔNG CÔNG VÀ OT
        float congThucTe = calculateTotalWorkDays(logs);
        float tongGioOtValue = calculateTotalOtHours(logs);
        float tongNgayCongHieuLuc = congThucTe + phepSuDungMoi;

        // 5. Tính toán tài chính
        BigDecimal luongCB = safe(nv.getLuongCoBan());
        BigDecimal heSo = BigDecimal.valueOf(nv.getHeSoLuong() != null ? nv.getHeSoLuong() : 1.0);
        BigDecimal luongThangNiemYet = luongCB.multiply(heSo);

        BigDecimal luong1Ngay = luongThangNiemYet.divide(BigDecimal.valueOf(config.getSoNgayCongChuan()), 2, RoundingMode.HALF_UP);
        BigDecimal luong1Gio = luong1Ngay.divide(BigDecimal.valueOf(config.getSoGioMotNgay()), 2, RoundingMode.HALF_UP);

        BigDecimal thanhTienCong = luong1Ngay.multiply(BigDecimal.valueOf(tongNgayCongHieuLuc));
        BigDecimal tienOt = luong1Gio.multiply(BigDecimal.valueOf(tongGioOtValue)).multiply(BigDecimal.valueOf(config.getHeSoOtNgayThuong()));

        // 6. Tính Phạt
        BigDecimal tongPhat = BigDecimal.ZERO;
        long diTreCount = 0;
        long veSomCount = 0;
        for (AttendanceDetail log : logs) {
            if (safeInt(log.getSoPhutDiTre()) > 0) {
                diTreCount++;
                BigDecimal mucPhat = (log.getSoPhutDiTre() <= 15) ? config.getTien_phat_tre_it_hon_15p() : config.getTien_phat_tre_nhieu_hon_15p();
                tongPhat = tongPhat.add(safe(mucPhat));
            }
            if (safeInt(log.getSoPhutVeSom()) > 0) {
                veSomCount++;
                tongPhat = tongPhat.add(safe(config.getTienPhatVeSom()));
            }
        }
        tongPhat = tongPhat.add(safe(config.getTien_phat_nghi_khong_phep()).multiply(BigDecimal.valueOf(ngayNghiKhongPhep)));

        // 7. Bảo hiểm & Thuế
        BigDecimal bhxh = luongThangNiemYet.multiply(BigDecimal.valueOf(safeDouble(config.getBhxhPercent()))).setScale(0, RoundingMode.HALF_UP);
        BigDecimal bhyt = luongThangNiemYet.multiply(BigDecimal.valueOf(safeDouble(config.getBhytPercent()))).setScale(0, RoundingMode.HALF_UP);
        BigDecimal bhtn = luongThangNiemYet.multiply(BigDecimal.valueOf(safeDouble(config.getBhtnPercent()))).setScale(0, RoundingMode.HALF_UP);
        BigDecimal tongBH = bhxh.add(bhyt).add(bhtn);

        BigDecimal tongThuNhapChuaThue = thanhTienCong.add(tienOt).add(safe(nv.getPhuCapCoDinh()));
        BigDecimal thueTNCN = calculateDynamicTax(tongThuNhapChuaThue, tongBH, nv.getSoNguoiPhuThuoc(), config, brackets);


        MonthlyPayroll bl = oldPayrollOpt.orElse(new MonthlyPayroll());
        bl.setNhanVien(nv); bl.setThang(thang); bl.setNam(nam);
        bl.setLuongNgayCong(thanhTienCong.setScale(0, RoundingMode.HALF_UP));
        bl.setLuongOt(tienOt.setScale(0, RoundingMode.HALF_UP));
        bl.setTongPhuCap(safe(nv.getPhuCapCoDinh()));
        bl.setKhauTruBhxh(bhxh); bl.setKhauTruBhyt(bhyt); bl.setKhauTruBhtn(bhtn);
        bl.setThueTncn(thueTNCN); bl.setTongTienPhat(tongPhat.setScale(0, RoundingMode.HALF_UP));
        bl.setSoNgayDiTre(diTreCount); bl.setSoNgayVeSom(veSomCount);
        bl.setPhepSuDung(phepSuDungMoi);
        bl.setTongNgayCong(tongNgayCongHieuLuc);
        bl.setTongGioOt(tongGioOtValue);

        BigDecimal thucLinh = tongThuNhapChuaThue.subtract(tongBH).subtract(thueTNCN).subtract(tongPhat);
        if (ngayNghiKhongPhep > 10) {
            thucLinh = BigDecimal.ZERO;
            bl.setGiaiTrinhPhat(String.format("Nghỉ không phép > 10 ngày (%.1f ngày), trừ 100%% lương. Vi phạm: %d trễ, %d sớm", ngayNghiKhongPhep, diTreCount, veSomCount));
        } else {
            bl.setGiaiTrinhPhat(String.format("Dùng %.1f phép, phạt %.1f ngày không phép. Vi phạm: %d trễ, %d sớm", phepSuDungMoi, ngayNghiKhongPhep, diTreCount, veSomCount));
        }
        
        bl.setThucLinh(thucLinh.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : thucLinh.setScale(0, RoundingMode.HALF_UP));

        bl.setThuongDoanhSo(safe(bl.getThuongDoanhSo()));
        bl.setTamUng(safe(bl.getTamUng()));
        bl.setDoanPhi(safe(bl.getDoanPhi()));

        return mapToPayrollResponse(repo.save(bl));
    }

    private BigDecimal calculateDynamicTax(BigDecimal tongThuNhap, BigDecimal mienThueBH, Integer soNPT, SystemConfig config, List<TaxBracket> brackets) {
        // 1. Tính Thu nhập tính thuế (TNTT)
        // TNTT = Tổng thu nhập - Bảo hiểm - Giảm trừ bản thân - Giảm trừ gia cảnh
        BigDecimal giamTruBanThan = safe(config.getGiamTruBanThan());
        BigDecimal giamTruNPT = safe(config.getGiamTruNguoiPhuThuoc());
        int soNguoiPhuThuoc = (soNPT != null) ? soNPT : 0;

        BigDecimal thuNhapTinhThue = tongThuNhap.subtract(mienThueBH)
                .subtract(giamTruBanThan)
                .subtract(giamTruNPT.multiply(BigDecimal.valueOf(soNguoiPhuThuoc)));

        // Nếu thu nhập sau khi giảm trừ mà <= 0 thì không phải nộp thuế
        if (thuNhapTinhThue.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        double tn = thuNhapTinhThue.doubleValue();
        TaxBracket matchedBracket = null;

        // 2. SỬ DỤNG VÒNG LẶP FOR ĐỂ TÌM BẬC THUẾ CAO NHẤT PHÙ HỢP
        for (TaxBracket b : brackets) {
            double nguongThuNhapCuaBac = b.getNguongThuNhap().doubleValue();

            // Điều kiện: Thu nhập thực tế phải lớn hơn ngưỡng của bậc đó
            if (tn > nguongThuNhapCuaBac) {
                // Chúng ta tìm bậc có ngưỡng cao nhất nhưng vẫn nhỏ hơn thu nhập (ví dụ: bậc 3, 4...)
                if (matchedBracket == null || nguongThuNhapCuaBac > matchedBracket.getNguongThuNhap().doubleValue()) {
                    matchedBracket = b;
                }
            }
        }

        // Trường hợp dự phòng nếu không tìm thấy bậc nào (thường lấy bậc thấp nhất)
        if (matchedBracket == null) {
            if (!brackets.isEmpty()) {
                matchedBracket = brackets.get(0);
            } else {
                return BigDecimal.ZERO;
            }
        }

        // 3. Tính thuế theo công thức rút gọn: (Thu nhập tính thuế * Thuế suất) - Giảm trừ bậc
        // Ví dụ bậc 2: (TNTT * 10%) - 0.25tr
        double thueSuat = matchedBracket.getThueSuat();
        double giamTruBac = matchedBracket.getGiamTruBac().doubleValue();

        double soTienThue = (tn * thueSuat) - giamTruBac;

        // Trả về kết quả, làm tròn về 0 chữ số thập phân (VND không để lẻ xu)
        return BigDecimal.valueOf(soTienThue).setScale(0, RoundingMode.HALF_UP);
    }

    public PayrollResponse mapToPayrollResponse(MonthlyPayroll bl) {
        if (bl == null) return null;

        // 1. Lấy Config để hiển thị các mức phạt unit trên bảng lương
        SystemConfig config = configRepo.findTopByOrderByIdAsc();

        // 2. Xử lý thu nhập (Safe null)
        BigDecimal luongNC = safe(bl.getLuongNgayCong());
        BigDecimal luongOT = safe(bl.getLuongOt());
        BigDecimal phuCap = safe(bl.getTongPhuCap());
        BigDecimal thuong = safe(bl.getThuongDoanhSo());
        BigDecimal tongThuNhap = luongNC.add(luongOT).add(phuCap).add(thuong);

        // 3. Xử lý khấu trừ (Safe null)
        BigDecimal bhxh = safe(bl.getKhauTruBhxh());
        BigDecimal bhyt = safe(bl.getKhauTruBhyt());
        BigDecimal bhtn = safe(bl.getKhauTruBhtn());
        BigDecimal thue = safe(bl.getThueTncn());
        BigDecimal phat = safe(bl.getTongTienPhat());
        BigDecimal doanPhi = safe(bl.getDoanPhi());
        BigDecimal tamUng = safe(bl.getTamUng());
        BigDecimal tongKhauTru = bhxh.add(bhyt).add(bhtn).add(thue).add(phat).add(doanPhi).add(tamUng);

        // 4. Build DTO
        return PayrollResponse.builder()
                .id(bl.getId())
                .nhanVienId(bl.getNhanVien() != null ? bl.getNhanVien().getId() : null)
                .maNv(bl.getNhanVien() != null ? bl.getNhanVien().getMaNv() : "N/A")
                .hoTen(bl.getNhanVien() != null ? bl.getNhanVien().getHoTen() : "N/A")
                .thang(bl.getThang())
                .nam(bl.getNam())

                // Nhóm Số lượng thực tế (Lấy từ Entity đã tính bằng vòng for)
                .tongNgayCong(safeFloat(bl.getTongNgayCong()))
                .soNgayDiTre(safeLong(bl.getSoNgayDiTre()))
                .soNgayVeSom(safeLong(bl.getSoNgayVeSom()))
                .tongGioOt(safeFloat(bl.getTongGioOt()))

                // Nhóm hằng số từ Admin
                .mucPhatDiTre(config != null ? safe(config.getTien_phat_tre_it_hon_15p()) : BigDecimal.ZERO)
                .mucPhatVeSom(config != null ? safe(config.getTienPhatVeSom()) : BigDecimal.ZERO)

                // Nhóm Tiền
                .luongNgayCong(luongNC)
                .luongOt(luongOT)
                .tongPhuCap(phuCap)
                .thuongDoanhSo(thuong)
                .tongThuNhap(tongThuNhap)
                .khauTruBhxh(bhxh)
                .tongTienPhat(phat)
                .khauTruBhyt(bhyt)
                .khauTruBhtn(bhtn)
                .doanPhi(doanPhi)
                .thueTncn(thue)
                .tongKhauTru(tongKhauTru)
                .tamUng(tamUng)
                .thucLinh(safe(bl.getThucLinh()))
                .chiTietPhat(bl.getGiaiTrinhPhat() != null ? bl.getGiaiTrinhPhat() : "Không có vi phạm")
                .build();
    }


    private BigDecimal safe(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }
    private float safeFloat(Float v) { return v != null ? v : 0f; }
    private double safeDouble(Double v) { return v != null ? v : 0.0; }
    private long safeLong(Long v) { return v != null ? v : 0L; }

    private int safeInt(Integer v) { return v != null ? v : 0; }
    @Override public PayrollResponse save(MonthlyPayroll bl) { return mapToPayrollResponse(repo.save(bl)); }
    @Override public void delete(Long id) { repo.deleteById(id); }
    @Override
    public List<PayrollResponse> findByNhanVien(Long nvId) {
        List<MonthlyPayroll> payrolls = repo.findByNhanVienId(nvId);
        List<PayrollResponse> resList = new ArrayList<>();
        for (MonthlyPayroll bl : payrolls) {
            resList.add(mapToPayrollResponse(bl));
        }
        return resList;
    }
    @Override
    public List<PayrollResponse> findByNhanVienAndThangNam(Long nvId, Integer thang, Integer nam) {
        Optional<MonthlyPayroll> payrollOpt = repo.findByNhanVienIdAndThangAndNam(nvId, thang, nam);
        List<PayrollResponse> resList = new ArrayList<>();
        if (payrollOpt.isPresent()) {
            MonthlyPayroll bl = payrollOpt.get();
            resList.add(mapToPayrollResponse(bl));
        }

        return resList;
    }


    @Override
    public PayrollResponse update(Long id, MonthlyPayroll data) {
        MonthlyPayroll existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy ID: " + id));
        existing.setThang(data.getThang());
        existing.setNam(data.getNam());
        existing.setLuongNgayCong(data.getLuongNgayCong());
        existing.setThucLinh(data.getThucLinh());
        return mapToPayrollResponse(repo.save(existing));
    }

    @Override
    @Transactional
    public void importFromExcel(MultipartFile file) throws Exception {
        // 1. Mở file Excel
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        // 2. Duyệt từng dòng (bắt đầu từ dòng 1 để bỏ qua tiêu đề)
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);

            // Kiểm tra nếu dòng trống thì bỏ qua
            if (row == null) {
                continue;
            }

            // 3. Lấy mã nhân viên từ cột đầu tiên (Cột 0)
            Cell cellMaNv = row.getCell(0);
            if (cellMaNv == null) continue;
            String maNV = cellMaNv.getStringCellValue();

            // 4. Tìm kiếm nhân viên bằng Optional nhưng xử lý bằng IF truyền thống
            Optional<Employee> nvOpt = nhanVienRepository.findByMaNv(maNV);

            if (nvOpt.isPresent()) {
                // Nếu tìm thấy nhân viên, tiến hành tạo bản ghi lương
                Employee nv = nvOpt.get();

                // Kiểm tra xem tháng/năm đó nhân viên này đã có lương chưa để tránh trùng lặp
                int thang = (int) row.getCell(2).getNumericCellValue();
                int nam = (int) row.getCell(3).getNumericCellValue();

                Optional<MonthlyPayroll> existingPayroll = repo.findByNhanVienIdAndThangAndNam(nv.getId(), thang, nam);
                MonthlyPayroll bl;

                if (existingPayroll.isPresent()) {
                    bl = existingPayroll.get(); // Nếu có rồi thì cập nhật
                } else {
                    bl = new MonthlyPayroll(); // Nếu chưa có thì tạo mới
                    bl.setNhanVien(nv);
                }

                // 5. Đổ dữ liệu từ các cột Excel vào Entity
                bl.setThang(thang);
                bl.setNam(nam);

                // Giả sử cột 14 là Thực lĩnh
                bl.setThucLinh(getCellValueAsBigDecimal(row.getCell(14)));

                // Gán các giá trị mặc định là 0 cho các cột mới để tránh NULL trong DB
                bl.setTongNgayCong(0.0f);
                bl.setTongGioOt(0.0f);
                bl.setLuongNgayCong(BigDecimal.ZERO);
                bl.setLuongOt(BigDecimal.ZERO);
                bl.setTongTienPhat(BigDecimal.ZERO);
                bl.setSoNgayDiTre(0L);
                bl.setSoNgayVeSom(0L);

                // 6. Lưu xuống Database
                repo.save(bl);

            } else {
                System.out.println("Cảnh báo: Không tìm thấy nhân viên mã " + maNV + " ở dòng " + (i + 1));
            }
        }

        // 7. Đóng workbook để giải phóng bộ nhớ
        workbook.close();
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null) return BigDecimal.ZERO;
        if (cell.getCellType() == CellType.NUMERIC) return BigDecimal.valueOf(cell.getNumericCellValue());
        if (cell.getCellType() == CellType.STRING) {
            String val = cell.getStringCellValue().replaceAll("[^\\d.]", "");
            return val.isEmpty() ? BigDecimal.ZERO : new BigDecimal(val);
        }
        return BigDecimal.ZERO;
    }

    // Hàm tính tổng ngày công thực tế (Dựa trên cột congThuong)
    private float calculateTotalWorkDays(List<AttendanceDetail> logs) {
        if (logs == null || logs.isEmpty()) return 0.0f;

        float totalWorkDays = 0.0f;
        for (AttendanceDetail log : logs) {
            // Kiểm tra null để tránh lỗi NullPointerException
            if (log.getCongThuong() != null) {
                totalWorkDays += log.getCongThuong();
            }
        }
        return totalWorkDays;
    }

    // Hàm tính tổng giờ tăng ca thực tế (Dựa trên cột gioTangCa)
    private float calculateTotalOtHours(List<AttendanceDetail> logs) {
        if (logs == null || logs.isEmpty()) return 0.0f;

        float totalOtHours = 0.0f;
        for (AttendanceDetail log : logs) {
            // Kiểm tra null cho cột giờ tăng ca
            if (log.getGioTangCa() != null) {
                totalOtHours += log.getGioTangCa();
            }
        }
        return totalOtHours;
    }



}