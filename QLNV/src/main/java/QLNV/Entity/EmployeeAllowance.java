package QLNV.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "nhan_vien_phu_cap")
public class EmployeeAllowance {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hop_dong_id")
    private LaborContract hopDong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phu_cap_id")
    private AllowanceConfig phuCap;

    private BigDecimal soTien;

    public EmployeeAllowance(Long id, LaborContract hopDong, AllowanceConfig phuCap, BigDecimal soTien) {
        this.id = id;
        this.hopDong = hopDong;
        this.phuCap = phuCap;
        this.soTien = soTien;
    }

    public EmployeeAllowance() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LaborContract getHopDong() {
        return hopDong;
    }

    public void setHopDong(LaborContract hopDong) {
        this.hopDong = hopDong;
    }

    public AllowanceConfig getPhuCap() {
        return phuCap;
    }

    public void setPhuCap(AllowanceConfig phuCap) {
        this.phuCap = phuCap;
    }

    public BigDecimal getSoTien() {
        return soTien;
    }

    public void setSoTien(BigDecimal soTien) {
        this.soTien = soTien;
    }
}

