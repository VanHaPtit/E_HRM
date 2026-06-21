package QLNV.Service;

import QLNV.DTO.request.AttendanceDetailRequest;
import QLNV.DTO.response.AttendanceDetailResponse;

import java.util.List;

public interface AttendanceDetailService {

    public List<AttendanceDetailResponse> findAll();

    public AttendanceDetailResponse findById(Long id);

    public AttendanceDetailResponse save(AttendanceDetailRequest request);

    public AttendanceDetailResponse update(Long id, AttendanceDetailRequest request);

    public AttendanceDetailResponse quetMaDiemDanh(Long nhanVienId, String token, String ipAddress);

    public AttendanceDetailResponse diemDanhBangIp(Long nhanVienId, String ipAddress);

    public void delete(Long id);

    public List<AttendanceDetailResponse> findByNhanVienId(Long nhanVienId);

}
