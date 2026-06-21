package QLNV.DTO.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public class DependentRequest {

    @NotNull(message = "ID nhân viên không được để trống")
    private Long nhanVienId;

    @NotBlank(message = "Họ tên người thân không được để trống")
    @Size(min = 2, max = 100, message = "Họ tên người thân phải từ 2 đến 100 ký tự")
    private String hoTenNguoiThan;

    @NotBlank(message = "Mối quan hệ không được để trống")
    private String quanHe;
    
    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải ở trong quá khứ")
    private LocalDate ngaySinh;
    
    @Pattern(regexp = "^[0-9]{10}(-[0-9]{3})?$", message = "Mã số thuế không hợp lệ")
    private String maSoThue;
    private LocalDate ngayBatDauGiamTru;
    private LocalDate ngayKetThucGiamTru;

    public DependentRequest() {}

    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }

    public String getHoTenNguoiThan() { return hoTenNguoiThan; }
    public void setHoTenNguoiThan(String hoTenNguoiThan) { this.hoTenNguoiThan = hoTenNguoiThan; }

    public String getQuanHe() { return quanHe; }
    public void setQuanHe(String quanHe) { this.quanHe = quanHe; }

    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getMaSoThue() { return maSoThue; }
    public void setMaSoThue(String maSoThue) { this.maSoThue = maSoThue; }

    public LocalDate getNgayBatDauGiamTru() { return ngayBatDauGiamTru; }
    public void setNgayBatDauGiamTru(LocalDate ngayBatDauGiamTru) { this.ngayBatDauGiamTru = ngayBatDauGiamTru; }

    public LocalDate getNgayKetThucGiamTru() { return ngayKetThucGiamTru; }
    public void setNgayKetThucGiamTru(LocalDate ngayKetThucGiamTru) { this.ngayKetThucGiamTru = ngayKetThucGiamTru; }
}
