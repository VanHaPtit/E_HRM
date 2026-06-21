package QLNV.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "phong_ban")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_phong_ban", nullable = false, length = 100)
    private String tenPhongBan;

    @Column(name = "mo_ta", length = 255)
    private String moTa;

    public Department() {}

    public Department(Long id, String tenPhongBan, String moTa) {
        this.id = id;
        this.tenPhongBan = tenPhongBan;
        this.moTa = moTa;
    }

    // Getter & Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenPhongBan() {
        return tenPhongBan;
    }

    public void setTenPhongBan(String tenPhongBan) {
        this.tenPhongBan = tenPhongBan;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }
}
