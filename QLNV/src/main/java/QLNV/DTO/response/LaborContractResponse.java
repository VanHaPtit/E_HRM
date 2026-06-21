package QLNV.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LaborContractResponse {
    private Long id;
    private String soHopDong;
    private Long nhanVienId;
    private String maNv;
    private String hoTen;
    private String loaiHopDong;
    private LocalDate ngayHieuLuc;
    private LocalDate ngayHetHan;
    private BigDecimal luongCoBan;
    private BigDecimal luongDongBhxh;
    private String fileDinhKemUrl;
    private String fileDinhKem;
    private String tinhTrangHieuLuc;
    private NhanVienDto nhanVien;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NhanVienDto {
        private Long id;
        private String maNv;
        private String hoTen;
    }
}
