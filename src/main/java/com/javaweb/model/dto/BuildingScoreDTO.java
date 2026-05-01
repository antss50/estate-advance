package com.javaweb.model.dto;

public class BuildingScoreDTO {
    private Long buildingId;
    private String buildingName;
    private Double priceScore;
    private Double legalScore;
    private Double liquidityScore;
    private Double totalScore;

    public BuildingScoreDTO() {}

    public BuildingScoreDTO(Long buildingId, String buildingName, Double priceScore,
                            Double legalScore, Double liquidityScore, Double totalScore) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.priceScore = priceScore;
        this.legalScore = legalScore;
        this.liquidityScore = liquidityScore;
        this.totalScore = totalScore;
    }

    // Getters and Setters
    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }
    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }
    public Double getPriceScore() { return priceScore; }
    public void setPriceScore(Double priceScore) { this.priceScore = priceScore; }
    public Double getLegalScore() { return legalScore; }
    public void setLegalScore(Double legalScore) { this.legalScore = legalScore; }
    public Double getLiquidityScore() { return liquidityScore; }
    public void setLiquidityScore(Double liquidityScore) { this.liquidityScore = liquidityScore; }
    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }
}