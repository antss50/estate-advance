package com.javaweb.model.response;

public class BuildingMatchScore {
    private Long buildingId;
    private String buildingName;
    private String address;
    private String transactionType;
    private Double price;
    private Double priceSale;
    private Double priceRent;
    private Double area;
    private String wardName;
    private String provinceName;
    private String buildingType;
    private Double priceMatchScore;
    private Double areaMatchScore;
    private Double locationMatchScore;
    private Double typeMatchScore;
    private Double totalScore;

    public BuildingMatchScore() {}

    public BuildingMatchScore(Long buildingId, String buildingName, String address,
                              String transactionType, Double price, Double priceSale, Double priceRent,
                              Double area, String wardName, String provinceName, String buildingType,
                              Double priceMatchScore, Double areaMatchScore,
                              Double locationMatchScore, Double typeMatchScore, Double totalScore) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.address = address;
        this.transactionType = transactionType;
        this.price = price;
        this.priceSale = priceSale;
        this.priceRent = priceRent;
        this.area = area;
        this.wardName = wardName;
        this.provinceName = provinceName;
        this.buildingType = buildingType;
        this.priceMatchScore = priceMatchScore;
        this.areaMatchScore = areaMatchScore;
        this.locationMatchScore = locationMatchScore;
        this.typeMatchScore = typeMatchScore;
        this.totalScore = totalScore;
    }

    // Getters and Setters
    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }
    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getPriceSale() { return priceSale; }
    public void setPriceSale(Double priceSale) { this.priceSale = priceSale; }
    public Double getPriceRent() { return priceRent; }
    public void setPriceRent(Double priceRent) { this.priceRent = priceRent; }
    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }
    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }
    public String getProvinceName() { return provinceName; }
    public void setProvinceName(String provinceName) { this.provinceName = provinceName; }
    public String getBuildingType() { return buildingType; }
    public void setBuildingType(String buildingType) { this.buildingType = buildingType; }
    public Double getPriceMatchScore() { return priceMatchScore; }
    public void setPriceMatchScore(Double priceMatchScore) { this.priceMatchScore = priceMatchScore; }
    public Double getAreaMatchScore() { return areaMatchScore; }
    public void setAreaMatchScore(Double areaMatchScore) { this.areaMatchScore = areaMatchScore; }
    public Double getLocationMatchScore() { return locationMatchScore; }
    public void setLocationMatchScore(Double locationMatchScore) { this.locationMatchScore = locationMatchScore; }
    public Double getTypeMatchScore() { return typeMatchScore; }
    public void setTypeMatchScore(Double typeMatchScore) { this.typeMatchScore = typeMatchScore; }
    public Double getTotalScore() { return totalScore; }
    public void setTotalScore(Double totalScore) { this.totalScore = totalScore; }
}