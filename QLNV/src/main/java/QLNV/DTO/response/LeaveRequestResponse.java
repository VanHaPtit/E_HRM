package QLNV.DTO.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LeaveRequestResponse {
    private Long id;
    private String loaiNghi;
    private LocalDateTime tuNgay;
    private LocalDateTime denNgay;
    private String trangThai;
    private String tenNguoiDuyet;
}
