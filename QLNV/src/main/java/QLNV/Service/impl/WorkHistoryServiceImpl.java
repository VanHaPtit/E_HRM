package QLNV.Service.impl;

import QLNV.Entity.WorkHistory;
import QLNV.Repository.WorkHistoryRepository;
import QLNV.Service.WorkHistoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkHistoryServiceImpl implements WorkHistoryService {

    private final WorkHistoryRepository repository;

    public WorkHistoryServiceImpl(WorkHistoryRepository repository) {
        this.repository = repository;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<WorkHistory> getAll() {
        return repository.findAll();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public WorkHistory getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public WorkHistory create(WorkHistory qtct) {
        return repository.save(qtct);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public WorkHistory update(Long id, WorkHistory qtct) {
        WorkHistory exist = repository.findById(id).orElse(null);
        if (exist == null) return null;

        exist.setNhanVien(qtct.getNhanVien());
        exist.setPhongBan(qtct.getPhongBan());
        exist.setChucVu(qtct.getChucVu());
        exist.setNgayHieuLuc(qtct.getNgayHieuLuc());
        exist.setNgayKetThuc(qtct.getNgayKetThuc());
        exist.setLoaiQuyetDinh(qtct.getLoaiQuyetDinh());

        return repository.save(exist);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<WorkHistory> findByNhanVien(Long nhanVienId) {
        return repository.findByNhanVienId(nhanVienId);
    }
}