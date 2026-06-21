package QLNV.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "system_config")
@Data
public class SystemConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal tienPhatDiTre;

    private BigDecimal tienPhatVeSom;

    private Double heSoOtNgayThuong;

    private Integer soNgayCongChuan;   // 26
    private Integer soGioMotNgay;      // 8

    private java.time.LocalTime gioVaoLam;
    private java.time.LocalTime gioRaLam;

    private Double bhxhPercent;        // 0.08
    private Double bhytPercent;        // 0.015
    private Double bhtnPercent;        // 0.01

    private BigDecimal giamTruBanThan;     // 11tr
    private BigDecimal giamTruNguoiPhuThuoc; // 4.4tr

    private BigDecimal tien_phat_tre_it_hon_15p;
    private BigDecimal tien_phat_tre_nhieu_hon_15p;
    private BigDecimal tien_phat_nghi_khong_phep ;
}
