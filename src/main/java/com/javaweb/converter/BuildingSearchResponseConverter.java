package com.javaweb.converter;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.enums.District;
import com.javaweb.model.response.BuildingSearchResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class BuildingSearchResponseConverter {
    @Autowired
    private ModelMapper modelMapper;

    public BuildingSearchResponse toBuildingSearchResponse(BuildingEntity buildingEntity)
    {
        BuildingSearchResponse res = modelMapper.map(buildingEntity, BuildingSearchResponse.class);
        res.setRentArea(buildingEntity.getRentAreas().stream()
                .map(entity -> String.valueOf(entity.getValue()))
                .collect(Collectors.joining(",")));
        String districtName = "";
        if(buildingEntity.getDistrict() != null && buildingEntity.getDistrict() != ""){
            districtName = buildingEntity.getDistrict();
        }
        if(districtName != null && districtName != ""){
            res.setAddress(buildingEntity.getStreet() + ", " + buildingEntity.getWard() + ", " + districtName);
        }
        return res;
    }
}
