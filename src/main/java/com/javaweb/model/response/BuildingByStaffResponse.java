package com.javaweb.model.response;

import java.util.List;

public class BuildingByStaffResponse {
    private Long buildingId;
    private String buildingName;
    private String address;
    private String street;
    private String wardName;
    private String provinceName;
    private Integer floorArea;
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

    // Constructors
    public BuildingByStaffResponse() {}

    public BuildingByStaffResponse(Long buildingId, String buildingName, String address,
                                   String street, String wardName, String provinceName,
                                   Integer floorArea, Double priceSale, Double priceRent,
                                   String transactionType, String type, String note,
                                   String image, String avatar, List<String> imageList) {
        this.buildingId = buildingId;
        this.buildingName = buildingName;
        this.address = address;
        this.street = street;
        this.wardName = wardName;
        this.provinceName = provinceName;
        this.floorArea = floorArea;
        this.priceSale = priceSale;
        this.priceRent = priceRent;
        this.transactionType = transactionType;
        this.type = type;
        this.note = note;
        this.image = image;
        this.avatar = avatar;
        this.imageList = imageList;
    }

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

    public Integer getFloorArea() { return floorArea; }
    public void setFloorArea(Integer floorArea) { this.floorArea = floorArea; }

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
}