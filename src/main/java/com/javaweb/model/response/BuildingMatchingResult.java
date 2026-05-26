package com.javaweb.model.response;

/**
 * Kết quả matching của một building.
 */
public class BuildingMatchingResult {

    private Long   buildingId;
    private String buildingName;
    private String address;
    private String propertyType;
    private Double priceRent;
    private Double priceSale;
    private Double floorArea;

    // ── Chi tiết điểm từng tiêu chí ─────────────────────────────────────────
    private double scoreLocation;
    private double scorePrice;
    private double scoreArea;
    private double scoreType;
    private double totalScore;      // Điểm tổng hợp [0, 1]

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public Double getPriceRent() { return priceRent; }
    public void setPriceRent(Double priceRent) { this.priceRent = priceRent; }

    public Double getPriceSale() { return priceSale; }
    public void setPriceSale(Double priceSale) { this.priceSale = priceSale; }

    public Double getFloorArea() { return floorArea; }
    public void setFloorArea(Double floorArea) { this.floorArea = floorArea; }

    public double getScoreLocation() { return scoreLocation; }
    public void setScoreLocation(double scoreLocation) { this.scoreLocation = scoreLocation; }

    public double getScorePrice() { return scorePrice; }
    public void setScorePrice(double scorePrice) { this.scorePrice = scorePrice; }

    public double getScoreArea() { return scoreArea; }
    public void setScoreArea(double scoreArea) { this.scoreArea = scoreArea; }

    public double getScoreType() { return scoreType; }
    public void setScoreType(double scoreType) { this.scoreType = scoreType; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double totalScore) { this.totalScore = totalScore; }
}