package QLNV.Entity;

import QLNV.Entity.Enum.EmployeeStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "nhan_vien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String maNv;

    private String hoTen;
    private LocalDate ngaySinh;
    private String gioiTinh;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "face_data", columnDefinition = "TEXT")
    private String faceData;

    private String cccd;
    private LocalDate ngayCap;
    private String noiCap;

    @Column(columnDefinition = "TEXT")
    private String diaChiThuongTru;

    @Column(columnDefinition = "TEXT")
    private String diaChiHienTai;

    private String soDienThoai;
    private String emailCongTy;
    private String emailCaNhan;

    private String maSoThue;
    private String soTaiKhoan;
    private String nganHang;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phong_ban_id")
    private Department phongBan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chuc_vu_id")
    private Position chucVu;

    @OneToMany(mappedBy = "nhanVien")
    @JsonIgnoreProperties("nhanVien")
    private List<MonthlyPayroll> bangLuongThangs;

    @Column(name = "luong_co_ban")
    private BigDecimal luongCoBan;

    @Column(name = "he_so_luong")
    private Double heSoLuong;

    @Column(name = "phu_cap_co_dinh")
    private BigDecimal phuCapCoDinh;

    @Column(name = "so_nguoi_phu_thuoc")
    private Integer soNguoiPhuThuoc;


}

