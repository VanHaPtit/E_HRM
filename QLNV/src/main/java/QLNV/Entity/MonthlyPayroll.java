
package QLNV.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "bang_luong_thang")
@Getter
@Setter
@AllArgsConstructor
public class MonthlyPayroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thang")
    private Integer thang;

    @Column(name = "nam")
    private Integer nam;

    // Mapping khóa ngoại nhan_vien_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    @JsonIgnoreProperties({"bangLuongThangs", "hibernateLazyInitializer", "handler"})
    private Employee nhanVien;


    @Column(name = "luong_ngay_cong")
    private BigDecimal luongNgayCong;

    @Column(name = "luong_ot")
    private BigDecimal luongOt;

    @Column(name = "tong_phu_cap")
    private BigDecimal tongPhuCap;

    @Column(name = "thuong_doanh_so")
    private BigDecimal thuongDoanhSo;

    @Column(name = "khau_tru_bhxh")
    private BigDecimal khauTruBhxh;

    @Column(name = "khau_tru_bhyt")
    private BigDecimal khauTruBhyt;

    @Column(name = "khau_tru_bhtn")
    private BigDecimal khauTruBhtn;

    @Column(name = "doan_phi")
    private BigDecimal doanPhi;

    @Column(name = "thue_tncn")
    private BigDecimal thueTncn;

    @Column(name = "tam_ung")
    private BigDecimal tamUng;

    @Column(name = "thuc_linh")
    private BigDecimal thucLinh;

    private Long soNgayDiTre;

    private Long soNgayVeSom;

    private BigDecimal tongTienPhat;

    private String giaiTrinhPhat;

    @Column(name = "tong_ngay_cong")
    private Float tongNgayCong;

    @Column(name = "tong_gio_ot")
    private Float tongGioOt;
    @Column(name = "phep_su_dung")
    private Float phepSuDung;

    public MonthlyPayroll() {}


}