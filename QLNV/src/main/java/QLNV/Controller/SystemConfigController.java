package QLNV.Controller;

import QLNV.Entity.SystemConfig;
import QLNV.Repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system-config")
@CrossOrigin("*")
public class SystemConfigController {

    @Autowired
    private SystemConfigRepository configRepo;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HR')")
    public SystemConfig getConfig() {
        SystemConfig config = configRepo.findTopByOrderByIdAsc();
        if (config == null) {
            config = new SystemConfig();
            config.setSoNgayCongChuan(22);
            config.setSoGioMotNgay(8);
            config.setGioVaoLam(java.time.LocalTime.of(8, 0));
            config.setGioRaLam(java.time.LocalTime.of(17, 30));
            config.setHeSoOtNgayThuong(1.5);
            config.setTien_phat_tre_it_hon_15p(java.math.BigDecimal.valueOf(50000));
            config.setTien_phat_tre_nhieu_hon_15p(java.math.BigDecimal.valueOf(100000));
            config.setTienPhatVeSom(java.math.BigDecimal.valueOf(100000));
            config.setTien_phat_nghi_khong_phep(java.math.BigDecimal.valueOf(500000));
            config.setBhxhPercent(0.08);
            config.setBhytPercent(0.015);
            config.setBhtnPercent(0.01);
            config.setGiamTruBanThan(java.math.BigDecimal.valueOf(11000000));
            config.setGiamTruNguoiPhuThuoc(java.math.BigDecimal.valueOf(4400000));
            config = configRepo.save(config);
        }
        // Tự động bổ sung nếu trước đó đã tạo SystemConfig nhưng chưa có giờ
        if (config.getGioVaoLam() == null) {
            config.setGioVaoLam(java.time.LocalTime.of(8, 0));
            config.setGioRaLam(java.time.LocalTime.of(17, 30));
            config = configRepo.save(config);
        }
        return config;
    }

    @PutMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public SystemConfig updateConfig(@RequestBody SystemConfig updatedConfig) {
        SystemConfig config = configRepo.findTopByOrderByIdAsc();
        if (config == null) {
            config = new SystemConfig();
        }
        
        config.setSoNgayCongChuan(updatedConfig.getSoNgayCongChuan());
        config.setSoGioMotNgay(updatedConfig.getSoGioMotNgay());
        config.setGioVaoLam(updatedConfig.getGioVaoLam());
        config.setGioRaLam(updatedConfig.getGioRaLam());
        config.setHeSoOtNgayThuong(updatedConfig.getHeSoOtNgayThuong());
        config.setTien_phat_tre_it_hon_15p(updatedConfig.getTien_phat_tre_it_hon_15p());
        config.setTien_phat_tre_nhieu_hon_15p(updatedConfig.getTien_phat_tre_nhieu_hon_15p());
        config.setTienPhatVeSom(updatedConfig.getTienPhatVeSom());
        config.setTien_phat_nghi_khong_phep(updatedConfig.getTien_phat_nghi_khong_phep());
        config.setBhxhPercent(updatedConfig.getBhxhPercent());
        config.setBhytPercent(updatedConfig.getBhytPercent());
        config.setBhtnPercent(updatedConfig.getBhtnPercent());
        config.setGiamTruBanThan(updatedConfig.getGiamTruBanThan());
        config.setGiamTruNguoiPhuThuoc(updatedConfig.getGiamTruNguoiPhuThuoc());

        return configRepo.save(config);
    }
}
