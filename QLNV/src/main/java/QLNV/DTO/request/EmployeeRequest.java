package QLNV.DTO.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;

@Data
public class EmployeeRequest {
    @NotBlank(message = "Mã nhân viên không được để trống")
    private String maNv;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2 đến 100 ký tự")
    private String hoTen;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải ở trong quá khứ")
    private LocalDate ngaySinh;
    
    private String gioiTinh;
    private String faceData;
    
    @Pattern(regexp = "^[0-9]{12}$", message = "CCCD/CMND phải bao gồm đúng 12 chữ số")
    private String cccd;
    
    @PastOrPresent(message = "Ngày cấp không được ở tương lai")
    private LocalDate ngayCap;
    
    private String noiCap;
    private String diaChiThuongTru;
    private String diaChiHienTai;

    @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không hợp lệ")
    private String soDienThoai;

    @Email(message = "Email công ty không hợp lệ")
    private String emailCongTy;

    @Email(message = "Email cá nhân không hợp lệ")
    private String emailCaNhan;
    
    @Pattern(regexp = "^[0-9]{10}(-[0-9]{3})?$", message = "Mã số thuế cá nhân không hợp lệ")
    private String maSoThue;
    
    private String soTaiKhoan;
    private String nganHang;
    private String trangThai;
    
    // Sử dụng ID thay vì tên để map chính xác
    private Long phongBanId;
    private Long chucVuId;

    @PositiveOrZero(message = "Lương cơ bản không được là số âm")
    private BigDecimal luongCoBan;
    
    @Positive(message = "Hệ số lương phải lớn hơn 0")
    private Double heSoLuong;
    
    @PositiveOrZero(message = "Phụ cấp cố định không được là số âm")
    private BigDecimal phuCapCoDinh;
    
    @PositiveOrZero(message = "Số người phụ thuộc không được âm")
    @Max(value = 20, message = "Số người phụ thuộc tối đa là 20")
    private Integer soNguoiPhuThuoc;
}
