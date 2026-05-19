package com.javaweb.converter;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.dto.BuildingDTO;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BuildingConverter {

    // Chuyển từ DTO -> Entity (thủ công)
    public BuildingEntity convertEntity(BuildingDTO dto) {
        BuildingEntity entity = new BuildingEntity();

        // Thông tin cơ bản
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setStreet(dto.getStreet());
        entity.setStructure(dto.getStructure());
        entity.setNote(dto.getNote());
        entity.setImage(dto.getImage());
        entity.setAvatar(dto.getAvatar());
        entity.setFloorArea(dto.getFloorArea());
        entity.setNumberOfBasement(dto.getNumberOfBasement());
        entity.setDirection(dto.getDirection());
        entity.setLevel(dto.getLevel());

        // Địa chỉ
        entity.setProvinceCode(dto.getProvinceCode());
        entity.setProvinceName(dto.getProvinceName());
        entity.setWardCode(dto.getWardCode());
        entity.setWardName(dto.getWardName());
        entity.setDistrictLegacy(dto.getDistrict());

        // Giá
        entity.setRentPrice(dto.getRentPrice());
        entity.setPriceSale(dto.getPriceSale());
        entity.setPriceRent(dto.getPriceRent());
        entity.setRentPriceDescription(dto.getRentPriceDescription());

        // Các loại phí
        entity.setServiceFee(dto.getServiceFee());
        entity.setCarFee(dto.getCarFee());
        entity.setMotoFee(dto.getMotoFee());
        entity.setOvertimeFee(dto.getOvertimeFee());
        entity.setWaterFee(dto.getWaterFee());
        entity.setElectricityFee(dto.getElectricityFee());

        // Các field khác
        entity.setDeposit(dto.getDeposit());
        entity.setPayment(dto.getPayment());
        entity.setRentTime(dto.getRentTime());
        entity.setDecorationTime(dto.getDecorationTime());
        entity.setBrokerageFee(dto.getBrokerageFee());
        entity.setManagerName(dto.getManagerName());
        entity.setManagerPhone(dto.getManagerPhone());
        entity.setMap(dto.getMap());
        entity.setLinkOfBuilding(dto.getLinkOfBuilding());
        entity.setLegal(dto.getLegal());
        entity.setTransactionType(dto.getTransactionType());

        // Property type
        if (dto.getPropertyType() != null && !dto.getPropertyType().isEmpty()) {
            entity.setPropertyType(dto.getPropertyType());
        }

        return entity;
    }

    // Chuyển từ Entity -> DTO (thủ công)
    public BuildingDTO convertToDTO(BuildingEntity entity) {
        if (entity == null) {
            return null;
        }

        BuildingDTO dto = new BuildingDTO();

        // Thông tin cơ bản
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setStreet(entity.getStreet());
        dto.setStructure(entity.getStructure());
        dto.setNote(entity.getNote());
        dto.setImage(entity.getImage());
        dto.setAvatar(entity.getAvatar());
        dto.setFloorArea(entity.getFloorArea());
        dto.setNumberOfBasement(entity.getNumberOfBasement());
        dto.setDirection(entity.getDirection());
        dto.setLevel(entity.getLevel());

        // Địa chỉ
        dto.setProvinceCode(entity.getProvinceCode());
        dto.setProvinceName(entity.getProvinceName());
        dto.setWardCode(entity.getWardCode());
        dto.setWardName(entity.getWardName());
        dto.setWard(entity.getWardName());
        dto.setDistrict(entity.getDistrictLegacy());

        // Giá
        dto.setRentPrice(entity.getRentPrice());
        dto.setPriceSale(entity.getPriceSale());
        dto.setPriceRent(entity.getPriceRent());
        dto.setRentPriceDescription(entity.getRentPriceDescription());

        // Các loại phí
        dto.setServiceFee(entity.getServiceFee());
        dto.setCarFee(entity.getCarFee());
        dto.setMotoFee(entity.getMotoFee());
        dto.setOvertimeFee(entity.getOvertimeFee());
        dto.setWaterFee(entity.getWaterFee());
        dto.setElectricityFee(entity.getElectricityFee());

        // Các field khác
        dto.setDeposit(entity.getDeposit());
        dto.setPayment(entity.getPayment());
        dto.setRentTime(entity.getRentTime());
        dto.setDecorationTime(entity.getDecorationTime());
        dto.setBrokerageFee(entity.getBrokerageFee());
        dto.setManagerName(entity.getManagerName());
        dto.setManagerPhone(entity.getManagerPhone());
        dto.setMap(entity.getMap());
        dto.setLinkOfBuilding(entity.getLinkOfBuilding());
        dto.setLegal(entity.getLegal());
        dto.setTransactionType(entity.getTransactionType());

        // Property type
        if (entity.getPropertyType() != null && !entity.getPropertyType().isEmpty()) {
            dto.setPropertyType(entity.getPropertyType());
        }

        // Xử lý rentArea
        if (entity.getRentAreas() != null && !entity.getRentAreas().isEmpty()) {
            String rentArea = entity.getRentAreas().stream()
                    .map(area -> String.valueOf(area.getValue()))
                    .collect(Collectors.joining(","));
            dto.setRentArea(rentArea);
        }

        return dto;
    }
}