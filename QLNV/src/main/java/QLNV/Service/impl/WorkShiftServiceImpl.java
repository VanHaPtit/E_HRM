package QLNV.Service.impl;

import QLNV.Entity.WorkShift;
import QLNV.Repository.WorkShiftRepository;
import QLNV.Service.WorkShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkShiftServiceImpl implements WorkShiftService {

    @Autowired
    private WorkShiftRepository repository;

    @Override
    public List<WorkShift> getAll() {
        return repository.findAll();
    }

    @Override
    public Optional<WorkShift> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public WorkShift save(WorkShift caLamViec) {
        return repository.save(caLamViec);
    }

    @Override
    public WorkShift update(Long id, WorkShift caLamViec) {
        WorkShift existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ca làm việc không tồn tại"));

        existing.setTenCa(caLamViec.getTenCa());
        existing.setGioVao(caLamViec.getGioVao());
        existing.setGioRa(caLamViec.getGioRa());
        existing.setNghiTruaBatDau(caLamViec.getNghiTruaBatDau());
        existing.setNghiTruaKetThuc(caLamViec.getNghiTruaKetThuc());
        existing.setSoCongChuan(caLamViec.getSoCongChuan());

        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Ca làm việc không tồn tại");
        }
        repository.deleteById(id);
    }
}

