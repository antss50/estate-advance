package com.javaweb.model.response;

/**
 * Payload chứa thông tin Building được nhúng trong ChatResponse.
 * Serialize thành JSON và lưu vào cột `payload` của chat_message.
 *
 * Field mapping với BuildingEntity:
 *   address      ← getFullAddress()       (street + wardName + provinceName)
 *   district     ← getDistrictLegacy()    (field quận/huyện legacy)
 *   rentPrice    ← getRentPrice()         (Double)
 *   area         ← getFloorArea().intValue()  (Double → Integer)
 *   thumbnailUrl ← getAvatar()
 */
public class BuildingCardPayload {

    private Long    buildingId;
    private String  buildingName;
    private String  address;
    private String  district;
    private Double  rentPrice;
    private String  rentPriceUnit;
    private Integer area;
    private String  thumbnailUrl;
    private String  note;

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Double getRentPrice() { return rentPrice; }
    public void setRentPrice(Double rentPrice) { this.rentPrice = rentPrice; }

    public String getRentPriceUnit() { return rentPriceUnit; }
    public void setRentPriceUnit(String rentPriceUnit) { this.rentPriceUnit = rentPriceUnit; }

    public Integer getArea() { return area; }
    public void setArea(Integer area) { this.area = area; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}