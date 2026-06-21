package QLNV.Service;

import QLNV.Entity.WorkHistory;

import java.util.List;

public interface WorkHistoryService {

    List<WorkHistory> getAll();

    WorkHistory getById(Long id);

    WorkHistory create(WorkHistory qtct);

    WorkHistory update(Long id, WorkHistory qtct);

    void delete(Long id);

    List<WorkHistory> findByNhanVien(Long nhanVienId);
}
