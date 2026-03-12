package com.javaweb.model.dto;

import java.util.List;

public class AssignmentBuildingDTO {
    private Long buildingId;
    private List<Long> staffIds;

    public Long getBuildingId() { return buildingId; }

    public void setBuildingId(Long buildingId) {
        this.buildingId = buildingId;
    }

    public List<Long> getStaffIds() {
        return staffIds;
    }

    public void setStaffIds(List<Long> staffIds) {
        this.staffIds = staffIds;
    }
}
