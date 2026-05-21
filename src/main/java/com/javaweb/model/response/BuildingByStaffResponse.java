package com.javaweb.model.response;

import java.util.List;

public class BuildingByStaffResponse {
    private Long buildingId;
    private String buildingName;
    private String address;
    private String street;
    private String wardName;
    private String provinceName;
    private Double floorArea;
    private Double priceSale;
    private Double priceRent;
    private String transactionType;
    private String type;
    private String note;
    private String image;
    private String avatar;
    private List<String> imageList;
    private String createdDate;
    private String modifiedDate;

    // ============ THÊM CÁC FIELD MỚI ============
    private String structure;
    private Integer numberOfBasement;
    private String direction;
    private String level;
    private Double rentPrice;
    private String rentPriceDescription;
    private Double serviceFee;
    private Double carFee;
    private Double motoFee;
    private Double overtimeFee;
    private Double waterFee;
    private Double electricityFee;
    private String deposit;
    private String payment;
    private String rentTime;
    private String decorationTime;
    private Double brokerageFee;
    private String managerName;
    private String managerPhone;
    private String legal;
    private String linkOfBuilding;
    private String map;
    // ============ END ============

    // Constructors
    public BuildingByStaffResponse() {}

    // Getters and Setters
    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public String getProvinceName() { return provinceName; }
    public void setProvinceName(String provinceName) { this.provinceName = provinceName; }

    public Double getFloorArea() { return floorArea; }
    public void setFloorArea(Double floorArea) { this.floorArea = floorArea; }

    public Double getPriceSale() { return priceSale; }
    public void setPriceSale(Double priceSale) { this.priceSale = priceSale; }

    public Double getPriceRent() { return priceRent; }
    public void setPriceRent(Double priceRent) { this.priceRent = priceRent; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public List<String> getImageList() { return imageList; }
    public void setImageList(List<String> imageList) { this.imageList = imageList; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

    public String getModifiedDate() { return modifiedDate; }
    public void setModifiedDate(String modifiedDate) { this.modifiedDate = modifiedDate; }

    // Getters and Setters cho các field mới
    public String getStructure() { return structure; }
    public void setStructure(String structure) { this.structure = structure; }

    public Integer getNumberOfBasement() { return numberOfBasement; }
    public void setNumberOfBasement(Integer numberOfBasement) { this.numberOfBasement = numberOfBasement; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Double getRentPrice() { return rentPrice; }
    public void setRentPrice(Double rentPrice) { this.rentPrice = rentPrice; }

    public String getRentPriceDescription() { return rentPriceDescription; }
    public void setRentPriceDescription(String rentPriceDescription) { this.rentPriceDescription = rentPriceDescription; }

    public Double getServiceFee() { return serviceFee; }
    public void setServiceFee(Double serviceFee) { this.serviceFee = serviceFee; }

    public Double getCarFee() { return carFee; }
    public void setCarFee(Double carFee) { this.carFee = carFee; }

    public Double getMotoFee() { return motoFee; }
    public void setMotoFee(Double motoFee) { this.motoFee = motoFee; }

    public Double getOvertimeFee() { return overtimeFee; }
    public void setOvertimeFee(Double overtimeFee) { this.overtimeFee = overtimeFee; }

    public Double getWaterFee() { return waterFee; }
    public void setWaterFee(Double waterFee) { this.waterFee = waterFee; }

    public Double getElectricityFee() { return electricityFee; }
    public void setElectricityFee(Double electricityFee) { this.electricityFee = electricityFee; }

    public String getDeposit() { return deposit; }
    public void setDeposit(String deposit) { this.deposit = deposit; }

    public String getPayment() { return payment; }
    public void setPayment(String payment) { this.payment = payment; }

    public String getRentTime() { return rentTime; }
    public void setRentTime(String rentTime) { this.rentTime = rentTime; }

    public String getDecorationTime() { return decorationTime; }
    public void setDecorationTime(String decorationTime) { this.decorationTime = decorationTime; }

    public Double getBrokerageFee() { return brokerageFee; }
    public void setBrokerageFee(Double brokerageFee) { this.brokerageFee = brokerageFee; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getManagerPhone() { return managerPhone; }
    public void setManagerPhone(String managerPhone) { this.managerPhone = managerPhone; }

    public String getLegal() { return legal; }
    public void setLegal(String legal) { this.legal = legal; }

    public String getLinkOfBuilding() { return linkOfBuilding; }
    public void setLinkOfBuilding(String linkOfBuilding) { this.linkOfBuilding = linkOfBuilding; }

    public String getMap() { return map; }
    public void setMap(String map) { this.map = map; }
}