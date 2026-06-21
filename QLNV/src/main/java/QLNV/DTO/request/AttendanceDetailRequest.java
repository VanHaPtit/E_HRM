package QLNV.DTO.request;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Data
public class AttendanceDetailRequest {
    @NotNull(message = "ID nhân viên không được để trống")
    private Long nhanVienId;
    private Long phienDiemDanhId;
    private LocalDate ngay;
    private LocalTime gioCheckIn;
    private LocalTime gioCheckOut;
    
    @PositiveOrZero(message = "Số phút đi trễ không được âm")
    private Integer soPhutDiTre;
    
    @PositiveOrZero(message = "Số phút về sớm không được âm")
    private Integer soPhutVeSom;
    
    @PositiveOrZero(message = "Công thường không được âm")
    private Float congThuong;
    
    @PositiveOrZero(message = "Giờ tăng ca không được âm")
    private Float gioTangCa;
    
    private String loaiNgay;
}
