package QLNV.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDetailResponse {
    private Long id;
    private Long nhanVienId;
    private String maNv;
    private String hoTen;
    private LocalDate ngay;
    private LocalTime gioCheckIn;
    private LocalTime gioCheckOut;
    private Integer soPhutDiTre;
    private Integer soPhutVeSom;
    private Float congThuong;
    private Float gioTangCa;
    private String loaiNgay;
    private Long phienDiemDanhId;
}
