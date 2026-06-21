package QLNV.DTO.mapper;

import QLNV.DTO.request.DepartmentRequest;
import QLNV.DTO.response.DepartmentResponse;
import QLNV.Entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public Department toEntity(DepartmentRequest request) {
        if (request == null) return null;
        Department entity = new Department();
        entity.setTenPhongBan(request.getTenPhongBan());
        entity.setMoTa(request.getMoTa());
        return entity;
    }

    public DepartmentResponse toResponse(Department entity) {
        if (entity == null) return null;
        DepartmentResponse response = new DepartmentResponse();
        response.setId(entity.getId());
        response.setTenPhongBan(entity.getTenPhongBan());
        response.setMoTa(entity.getMoTa());
        return response;
    }
}
