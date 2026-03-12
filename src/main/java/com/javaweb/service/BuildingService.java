package com.javaweb.service;

import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.model.response.ResponseDTO;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

public interface BuildingService {
    ResponseDTO listStaffs(Long buildingId);
    List<BuildingSearchResponse>  findAll(BuildingSearchRequest buildingSearchRequest);
    BuildingDTO addOrUpdateBuilding(@RequestBody BuildingDTO buildingDTO);
    BuildingDTO getBuildingById(Long id);
    void deleteBuilding(List<Long> ids);

}
