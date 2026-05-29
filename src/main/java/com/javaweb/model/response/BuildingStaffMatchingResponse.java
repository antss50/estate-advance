package com.javaweb.model.response;

import java.util.List;

public class BuildingStaffMatchingResponse {

    private Long   buildingId;
    private String buildingName;
    private String buildingAddress;

    // ── Điểm khó của building ─────────────────────────────────────────────────
    private double scoreBuilding;

    private int    totalFound;
    private List<BuildingStaffMatchingResult> results;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getBuildingAddress() { return buildingAddress; }
    public void setBuildingAddress(String buildingAddress) { this.buildingAddress = buildingAddress; }

    public double getScoreBuilding() { return scoreBuilding; }
    public void setScoreBuilding(double scoreBuilding) { this.scoreBuilding = scoreBuilding; }

    public int getTotalFound() { return totalFound; }
    public void setTotalFound(int totalFound) { this.totalFound = totalFound; }

    public List<BuildingStaffMatchingResult> getResults() { return results; }
    public void setResults(List<BuildingStaffMatchingResult> results) { this.results = results; }
}