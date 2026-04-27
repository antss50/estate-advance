package com.javaweb.converter;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.dto.BuildingDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BuildingConverter {
    @Autowired
    private ModelMapper modelMapper;

    // Chuyển từ DTO -> Entity
    public BuildingEntity convertEntity(BuildingDTO buildingDTO) {
        BuildingEntity buildingEntity = this.modelMapper.map(buildingDTO, BuildingEntity.class);

        // Xử lý typeCode (String[]) -> String (join bằng dấu phẩy)
        if (buildingDTO.getTypeCode() != null && buildingDTO.getTypeCode().length > 0) {
            String type = String.join(",", buildingDTO.getTypeCode());
            buildingEntity.setType(type);
        }

        return buildingEntity;
    }

    // Chuyển từ Entity -> DTO (cập nhật)
    public void convertEntity(BuildingEntity buildingEntity, BuildingDTO buildingDTO) {
        modelMapper.map(buildingEntity, buildingDTO);

        // Xử lý type từ String -> String[]
        if (buildingEntity.getType() != null && !buildingEntity.getType().isEmpty()) {
            String[] typeCodes = buildingEntity.getType().split(",");
            buildingDTO.setTypeCode(typeCodes);
        }

        // Xử lý rentArea
        if (buildingEntity.getRentAreas() != null && !buildingEntity.getRentAreas().isEmpty()) {
            String rentAreaString = buildingEntity.getRentAreas().stream()
                    .map(rentArea -> String.valueOf(rentArea.getValue()))
                    .collect(Collectors.joining(","));
            buildingDTO.setRentArea(rentAreaString);
        }
    }

    // Chuyển từ Entity -> DTO
    public BuildingDTO convertToDTO(BuildingEntity buildingEntity) {
        if (buildingEntity == null) {
            return null;
        }

        BuildingDTO buildingDTO = modelMapper.map(buildingEntity, BuildingDTO.class);

        // Xử lý type từ String -> String[]
        if (buildingEntity.getType() != null && !buildingEntity.getType().isEmpty()) {
            String[] typeCodes = buildingEntity.getType().split(",");
            buildingDTO.setTypeCode(typeCodes);
        }

        // Xử lý rentArea
        if (buildingEntity.getRentAreas() != null && !buildingEntity.getRentAreas().isEmpty()) {
            String rentAreaString = buildingEntity.getRentAreas().stream()
                    .map(rentArea -> String.valueOf(rentArea.getValue()))
                    .collect(Collectors.joining(","));
            buildingDTO.setRentArea(rentAreaString);
        }

        return buildingDTO;
    }
}