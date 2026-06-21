package QLNV.Service;

import QLNV.DTO.response.PayrollResponse;
import QLNV.Entity.MonthlyPayroll;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface MonthlyPayrollService {

    List<PayrollResponse> getAll();

    Optional<PayrollResponse> getById(Long id);

    PayrollResponse save(MonthlyPayroll bangLuongThang);

    PayrollResponse update(Long id, MonthlyPayroll data);

    void delete(Long id);

    List<PayrollResponse> findByNhanVien(Long nvId);

    List<PayrollResponse> findByNhanVienAndThangNam(Long nvId, Integer thang, Integer nam);

    void importFromExcel(MultipartFile file) throws Exception;
    public PayrollResponse calculateMonthlySalary(Long nvId, int thang, int nam) ;
}