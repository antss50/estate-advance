package com.javaweb.service;

import com.javaweb.model.dto.AssignmentBuildingDTO;

import java.util.List;

public interface AssignmentBuildingService {
    void addOrUpdateAssignmentBuilding(AssignmentBuildingDTO assignmentBuildingDTO);
    void deleteByBuildingIds(List<Long> ids);
}
