package com.javaweb.service;

import com.javaweb.entity.RentAreaEntity;
import com.javaweb.model.dto.BuildingDTO;

import java.util.List;

public interface RentAreaService {
    public void addRentArea(BuildingDTO buildingDTO);
    public void deleteByBuildingIds(List<Long> ids);
}
