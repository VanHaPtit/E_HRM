package QLNV.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chuc_vu")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Position {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenChucVu;
    private Integer capBac;

    public Position(Long id, String tenChucVu, Integer capBac) {
        this.id = id;
        this.tenChucVu = tenChucVu;
        this.capBac = capBac;
    }

    public Position() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenChucVu() {
        return tenChucVu;
    }

    public void setTenChucVu(String tenChucVu) {
        this.tenChucVu = tenChucVu;
    }

    public Integer getCapBac() {
        return capBac;
    }

    public void setCapBac(Integer capBac) {
        this.capBac = capBac;
    }
}

