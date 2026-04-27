package com.javaweb.model.response;

import java.util.List;

public class CustomerMatchingResponse {
    private Long customerId;
    private Double desiredPrice;
    private Double desiredArea;
    private String desiredWard;
    private String desiredProvince;
    private String priorityType;
    private List<BuildingMatchScore> suggestedBuildings;
    private Integer totalMatches;

    public CustomerMatchingResponse() {}

    public CustomerMatchingResponse(Long customerId, Double desiredPrice, Double desiredArea,
                                    String desiredWard, String desiredProvince, String priorityType,
                                    List<BuildingMatchScore> suggestedBuildings) {
        this.customerId = customerId;
        this.desiredPrice = desiredPrice;
        this.desiredArea = desiredArea;
        this.desiredWard = desiredWard;
        this.desiredProvince = desiredProvince;
        this.priorityType = priorityType;
        this.suggestedBuildings = suggestedBuildings;
        this.totalMatches = suggestedBuildings != null ? suggestedBuildings.size() : 0;
    }

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Double getDesiredPrice() { return desiredPrice; }
    public void setDesiredPrice(Double desiredPrice) { this.desiredPrice = desiredPrice; }
    public Double getDesiredArea() { return desiredArea; }
    public void setDesiredArea(Double desiredArea) { this.desiredArea = desiredArea; }
    public String getDesiredWard() { return desiredWard; }
    public void setDesiredWard(String desiredWard) { this.desiredWard = desiredWard; }
    public String getDesiredProvince() { return desiredProvince; }
    public void setDesiredProvince(String desiredProvince) { this.desiredProvince = desiredProvince; }
    public String getPriorityType() { return priorityType; }
    public void setPriorityType(String priorityType) { this.priorityType = priorityType; }
    public List<BuildingMatchScore> getSuggestedBuildings() { return suggestedBuildings; }
    public void setSuggestedBuildings(List<BuildingMatchScore> suggestedBuildings) { this.suggestedBuildings = suggestedBuildings; }
    public Integer getTotalMatches() { return totalMatches; }
    public void setTotalMatches(Integer totalMatches) { this.totalMatches = totalMatches; }
}