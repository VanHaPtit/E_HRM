package QLNV.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cau_hinh_phu_cap")
public class AllowanceConfig {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenPhuCap;

    private boolean tinhThueTncn;
    private boolean dongBhxh;

    public AllowanceConfig(Long id, String tenPhuCap, boolean tinhThueTncn, boolean dongBhxh) {
        this.id = id;
        this.tenPhuCap = tenPhuCap;
        this.tinhThueTncn = tinhThueTncn;
        this.dongBhxh = dongBhxh;
    }

    public AllowanceConfig() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenPhuCap() {
        return tenPhuCap;
    }

    public void setTenPhuCap(String tenPhuCap) {
        this.tenPhuCap = tenPhuCap;
    }

    public boolean isTinhThueTncn() {
        return tinhThueTncn;
    }

    public void setTinhThueTncn(boolean tinhThueTncn) {
        this.tinhThueTncn = tinhThueTncn;
    }

    public boolean isDongBhxh() {
        return dongBhxh;
    }

    public void setDongBhxh(boolean dongBhxh) {
        this.dongBhxh = dongBhxh;
    }
}

