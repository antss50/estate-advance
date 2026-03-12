package com.javaweb.converter;

import java.util.List;
import com.javaweb.model.request.BuildingSearchRequest;
import org.springframework.stereotype.Component;
import com.javaweb.builder.BuildingSearchBuilder;

@Component
public class BuildingSearchBuilderConverter {
    public BuildingSearchBuilder toBuildingSearchBuilder(BuildingSearchRequest params, List<String> typeCode) {
        BuildingSearchBuilder buildingSearchBuilder = new BuildingSearchBuilder.Builder()
                .setName(params.getName())
                .setAreaFrom(params.getAreaFrom())
                .setAreaTo(params.getAreaTo())
                .setDistrict(params.getDistrict())
                .setFloorArea(params.getFloorArea())
                .setManagerName(params.getManagerName())
                .setManagerPhone(params.getManagerPhone())
                .setNumberOfBasement(params.getNumberOfBasement())
                .setRentPriceFrom(params.getRentPriceFrom())
                .setRentPriceTo(params.getRentPriceTo())
                .setStaffId(params.getStaffId())
                .setStreet(params.getStreet())
                .setTypeCode(typeCode != null ? typeCode : params.getTypeCode()) // Có thể dùng cả hai
                .setWard(params.getWard())
                .setDirection(params.getDirection())
                .setLevel(params.getLevel())
                .build();
        return buildingSearchBuilder;
    }
}