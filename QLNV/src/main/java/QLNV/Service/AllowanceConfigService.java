package QLNV.Service;

import QLNV.Entity.AllowanceConfig;

import java.util.List;

public interface AllowanceConfigService {
    List<AllowanceConfig> getAll();
    AllowanceConfig getById(Long id);
    AllowanceConfig create(AllowanceConfig phuCap);
    AllowanceConfig update(Long id, AllowanceConfig phuCapUpdate);
    void delete(Long id);
}
