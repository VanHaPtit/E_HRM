package QLNV.Service.impl;

import QLNV.DTO.request.AllowedIpRequest;
import QLNV.DTO.response.AllowedIpResponse;
import QLNV.Entity.AllowedIp;
import QLNV.Repository.AllowedIpRepository;
import QLNV.Service.AllowedIpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AllowedIpServiceImpl implements AllowedIpService {

    @Autowired
    private AllowedIpRepository repository;

    private AllowedIpResponse mapToResponse(AllowedIp entity) {
        AllowedIpResponse response = new AllowedIpResponse();
        response.setId(entity.getId());
        response.setIpAddress(entity.getIpAddress());
        response.setDescription(entity.getDescription());
        response.setActive(entity.isActive());
        return response;
    }

    @Override
    public List<AllowedIpResponse> getAll() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public AllowedIpResponse create(AllowedIpRequest request) {
        AllowedIp entity = new AllowedIp();
        entity.setIpAddress(request.getIpAddress());
        entity.setDescription(request.getDescription());
        entity.setActive(request.getActive() != null ? request.getActive() : true);
        return mapToResponse(repository.save(entity));
    }

    @Override
    public AllowedIpResponse update(Long id, AllowedIpRequest request) {
        AllowedIp entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy IP cấu hình"));
        if (request.getIpAddress() != null) entity.setIpAddress(request.getIpAddress());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getActive() != null) entity.setActive(request.getActive());
        return mapToResponse(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean isIpAllowed(String ipAddress) {
        if ("0:0:0:0:0:0:0:1".equals(ipAddress) || "::1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }
        return repository.findByIpAddressAndIsActiveTrue(ipAddress).isPresent();
    }
}
