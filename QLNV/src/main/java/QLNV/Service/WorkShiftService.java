package QLNV.Service;

import QLNV.Entity.WorkShift;

import java.util.List;
import java.util.Optional;

public interface WorkShiftService {

    List<WorkShift> getAll();
    Optional<WorkShift> getById(Long id);
    WorkShift save(WorkShift caLamViec);
    WorkShift update(Long id, WorkShift caLamViec);
    void delete(Long id);
}
