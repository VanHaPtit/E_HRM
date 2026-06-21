package QLNV.DTO.mapper;

import QLNV.DTO.request.RoleRequest;
import QLNV.DTO.response.RoleResponse;
import QLNV.Entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    public Role toEntity(RoleRequest request) {
        if (request == null) return null;
        Role entity = new Role();
        entity.setTenRole(request.getTenRole());
        return entity;
    }

    public RoleResponse toResponse(Role entity) {
        if (entity == null) return null;
        RoleResponse response = new RoleResponse();
        response.setId(entity.getId());
        response.setTenRole(entity.getTenRole());
        return response;
    }
}
