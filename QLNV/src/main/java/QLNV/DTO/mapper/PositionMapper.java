package QLNV.DTO.mapper;

import QLNV.DTO.request.PositionRequest;
import QLNV.DTO.response.PositionResponse;
import QLNV.Entity.Position;
import org.springframework.stereotype.Component;

@Component
public class PositionMapper {

    public Position toEntity(PositionRequest request) {
        if (request == null) return null;
        Position entity = new Position();
        entity.setTenChucVu(request.getTenChucVu());
        entity.setCapBac(request.getCapBac());
        return entity;
    }

    public PositionResponse toResponse(Position entity) {
        if (entity == null) return null;
        PositionResponse response = new PositionResponse();
        response.setId(entity.getId());
        response.setTenChucVu(entity.getTenChucVu());
        response.setCapBac(entity.getCapBac());
        return response;
    }
}
