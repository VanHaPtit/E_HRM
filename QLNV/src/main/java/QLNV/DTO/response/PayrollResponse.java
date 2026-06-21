package QLNV.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PayrollResponse {
    private Long id;
    private Long nhanVienId;
    private String maNv;
    private String hoTen;
    private Integer thang;
    private Integer nam;
    private Float tongNgayCong;
    private Long soNgayDiTre;
    private Long soNgayVeSom;
    private Float tongGioOt;
    private BigDecimal mucPhatDiTre;
    private BigDecimal mucPhatVeSom;

    private BigDecimal luongNgayCong;
    private BigDecimal luongOt;
    private BigDecimal tongPhuCap;
    private BigDecimal thuongDoanhSo;
    private BigDecimal tongThuNhap;


    private BigDecimal khauTruBhxh;
    private BigDecimal tongTienPhat;
    private BigDecimal khauTruBhyt;
    private BigDecimal khauTruBhtn;
    private BigDecimal doanPhi;
    private BigDecimal thueTncn;
    private BigDecimal tongKhauTru;

    private BigDecimal tamUng;
    private BigDecimal thucLinh;

    private String chiTietPhat;

}