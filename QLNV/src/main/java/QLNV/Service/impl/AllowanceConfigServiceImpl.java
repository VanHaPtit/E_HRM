package QLNV.Service.impl;

import QLNV.Entity.AllowanceConfig;
import QLNV.Repository.AllowanceConfigRepository;
import QLNV.Service.AllowanceConfigService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AllowanceConfigServiceImpl implements AllowanceConfigService {

    private final AllowanceConfigRepository repository;

    public AllowanceConfigServiceImpl(AllowanceConfigRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<AllowanceConfig> getAll() {
        return repository.findAll();
    }

    @Override
    public AllowanceConfig getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ cấp ID = " + id));
    }

    @Override
    public AllowanceConfig create(AllowanceConfig phuCap) {
        return repository.save(phuCap);
    }

    @Override
    public AllowanceConfig update(Long id, AllowanceConfig phuCapUpdate) {
        AllowanceConfig old = getById(id);

        old.setTenPhuCap(phuCapUpdate.getTenPhuCap());
        old.setTinhThueTncn(phuCapUpdate.isTinhThueTncn());
        old.setDongBhxh(phuCapUpdate.isDongBhxh());

        return repository.save(old);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
