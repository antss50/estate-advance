package com.javaweb.model.dto;

import com.javaweb.enums.CustomerPriorityType;

public class DemandDTO {

    private Double area;           // Diện tích mong muốn
    private Double price;          // Giá mong muốn (mua hoặc thuê)
    private String location;       // Vị trí mong muốn (phường/xã)

    // ============ THÊM CÁC TIÊU CHÍ MỚI ============
    private String district;
    private String province;
    private String buildingType;
    private String transactionType;

    // ============ THÔNG TIN BỔ SUNG ============
    private Integer numberOfBasement; // Số tầng hầm mong muốn
    private String direction;         // Hướng nhà
    private String legalStatus;       // Tình trạng pháp lý: "Đã có sổ", "Đang chờ sổ",...
    private Double brokerageFee;      // Phí môi giới mong muốn

    private CustomerPriorityType priorityType;
    // ============ END ============

    public DemandDTO() {}

    // Getters and Setters hiện có
    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    // ============ GETTERS AND SETTERS MỚI ============
    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public Integer getNumberOfBasement() {
        return numberOfBasement;
    }

    public void setNumberOfBasement(Integer numberOfBasement) {
        this.numberOfBasement = numberOfBasement;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getLegalStatus() {
        return legalStatus;
    }

    public void setLegalStatus(String legalStatus) {
        this.legalStatus = legalStatus;
    }

    public Double getBrokerageFee() {
        return brokerageFee;
    }

    public void setBrokerageFee(Double brokerageFee) {
        this.brokerageFee = brokerageFee;
    }

    public CustomerPriorityType getPriorityType() {
        return priorityType;
    }

    public void setPriorityType(CustomerPriorityType priorityType) {
        this.priorityType = priorityType;
    }
}