package QLNV.Repository;


import QLNV.Entity.WorkHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkHistoryRepository extends JpaRepository<WorkHistory, Long> {

    List<WorkHistory> findByNhanVienId(Long nhanVienId);
}
