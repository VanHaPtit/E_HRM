package QLNV.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "quy_phep_nam")
public class AnnualLeave {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private Employee nhanVien;

    private Integer nam;
    private Float tongPhepDuocCap;
    private Float phepDaNghi;
    private Float phepTonNamTruoc;

    public AnnualLeave(Long id, Employee nhanVien, Integer nam, Float tongPhepDuocCap, Float phepDaNghi, Float phepTonNamTruoc) {
        this.id = id;
        this.nhanVien = nhanVien;
        this.nam = nam;
        this.tongPhepDuocCap = tongPhepDuocCap;
        this.phepDaNghi = phepDaNghi;
        this.phepTonNamTruoc = phepTonNamTruoc;
    }

    public AnnualLeave() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(Employee nhanVien) {
        this.nhanVien = nhanVien;
    }

    public Integer getNam() {
        return nam;
    }

    public void setNam(Integer nam) {
        this.nam = nam;
    }

    public Float getTongPhepDuocCap() {
        return tongPhepDuocCap;
    }

    public void setTongPhepDuocCap(Float tongPhepDuocCap) {
        this.tongPhepDuocCap = tongPhepDuocCap;
    }

    public Float getPhepDaNghi() {
        return phepDaNghi;
    }

    public void setPhepDaNghi(Float phepDaNghi) {
        this.phepDaNghi = phepDaNghi;
    }

    public Float getPhepTonNamTruoc() {
        return phepTonNamTruoc;
    }

    public void setPhepTonNamTruoc(Float phepTonNamTruoc) {
        this.phepTonNamTruoc = phepTonNamTruoc;
    }
}

