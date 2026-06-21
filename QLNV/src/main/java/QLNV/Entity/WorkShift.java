package QLNV.Entity;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "ca_lam_viec")
public class WorkShift {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenCa;
    private LocalTime gioVao;
    private LocalTime gioRa;

    private LocalTime nghiTruaBatDau;
    private LocalTime nghiTruaKetThuc;

    private Float soCongChuan;

    public WorkShift() {
    }

    public WorkShift(Long id, String tenCa, LocalTime gioVao, LocalTime gioRa, LocalTime nghiTruaBatDau, LocalTime nghiTruaKetThuc, Float soCongChuan) {
        this.id = id;
        this.tenCa = tenCa;
        this.gioVao = gioVao;
        this.gioRa = gioRa;
        this.nghiTruaBatDau = nghiTruaBatDau;
        this.nghiTruaKetThuc = nghiTruaKetThuc;
        this.soCongChuan = soCongChuan;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTenCa() {
        return tenCa;
    }

    public void setTenCa(String tenCa) {
        this.tenCa = tenCa;
    }

    public LocalTime getGioVao() {
        return gioVao;
    }

    public void setGioVao(LocalTime gioVao) {
        this.gioVao = gioVao;
    }

    public LocalTime getGioRa() {
        return gioRa;
    }

    public void setGioRa(LocalTime gioRa) {
        this.gioRa = gioRa;
    }

    public LocalTime getNghiTruaBatDau() {
        return nghiTruaBatDau;
    }

    public void setNghiTruaBatDau(LocalTime nghiTruaBatDau) {
        this.nghiTruaBatDau = nghiTruaBatDau;
    }

    public LocalTime getNghiTruaKetThuc() {
        return nghiTruaKetThuc;
    }

    public void setNghiTruaKetThuc(LocalTime nghiTruaKetThuc) {
        this.nghiTruaKetThuc = nghiTruaKetThuc;
    }

    public Float getSoCongChuan() {
        return soCongChuan;
    }

    public void setSoCongChuan(Float soCongChuan) {
        this.soCongChuan = soCongChuan;
    }
}

