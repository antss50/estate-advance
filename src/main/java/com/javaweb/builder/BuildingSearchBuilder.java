package com.javaweb.builder;

import java.util.List;

public class BuildingSearchBuilder {
    private String name;
    private Long floorArea;
    private String district;      // ĐÃ SỬA: Long districtId → String district
    private String ward;
    private String street;
    private Long numberOfBasement;
    private List<String> typeCode;
    private String managerName;
    private String managerPhone;  // ĐÃ SỬA: managerPhoneNumber → managerPhone
    private Long areaFrom;
    private Long areaTo;
    private Long rentPriceFrom;
    private Long rentPriceTo;
    private Long staffId;
    private String direction;     // ĐÃ THÊM: từ Request
    private Long level;           // ĐÃ THÊM: từ Request

    private BuildingSearchBuilder(Builder builder) {
        this.name = builder.name;
        this.floorArea = builder.floorArea;
        this.district = builder.district;        // ĐÃ SỬA
        this.ward = builder.ward;
        this.street = builder.street;
        this.numberOfBasement = builder.numberOfBasement;
        this.typeCode = builder.typeCode;
        this.managerName = builder.managerName;
        this.managerPhone = builder.managerPhone;  // ĐÃ SỬA
        this.areaFrom = builder.areaFrom;
        this.areaTo = builder.areaTo;
        this.rentPriceFrom = builder.rentPriceFrom;
        this.rentPriceTo = builder.rentPriceTo;
        this.staffId = builder.staffId;
        this.direction = builder.direction;      // ĐÃ THÊM
        this.level = builder.level;              // ĐÃ THÊM
    }

    // Các getter
    public String getName() { return name; }
    public Long getFloorArea() { return floorArea; }
    public String getDistrict() { return district; }  // ĐÃ SỬA
    public String getWard() { return ward; }
    public String getStreet() { return street; }
    public Long getNumberOfBasement() { return numberOfBasement; }
    public List<String> getTypeCode() { return typeCode; }
    public String getManagerName() { return managerName; }
    public String getManagerPhone() { return managerPhone; }  // ĐÃ SỬA
    public Long getAreaFrom() { return areaFrom; }
    public Long getAreaTo() { return areaTo; }
    public Long getRentPriceFrom() { return rentPriceFrom; }
    public Long getRentPriceTo() { return rentPriceTo; }
    public Long getStaffId() { return staffId; }
    public String getDirection() { return direction; }  // ĐÃ THÊM
    public Long getLevel() { return level; }            // ĐÃ THÊM

    public static class Builder {
        private String name;
        private Long floorArea;
        private String district;        // ĐÃ SỬA
        private String ward;
        private String street;
        private Long numberOfBasement;
        private List<String> typeCode;
        private String managerName;
        private String managerPhone;    // ĐÃ SỬA
        private Long areaFrom;
        private Long areaTo;
        private Long rentPriceFrom;
        private Long rentPriceTo;
        private Long staffId;
        private String direction;       // ĐÃ THÊM
        private Long level;             // ĐÃ THÊM

        public Builder setName(String name) {
            this.name = name;
            return this;
        }
        public Builder setFloorArea(Long floorArea) {
            this.floorArea = floorArea;
            return this;
        }
        public Builder setDistrict(String district) {  // ĐÃ SỬA
            this.district = district;
            return this;
        }
        public Builder setWard(String ward) {
            this.ward = ward;
            return this;
        }
        public Builder setStreet(String street) {
            this.street = street;
            return this;
        }
        public Builder setNumberOfBasement(Long numberOfBasement) {
            this.numberOfBasement = numberOfBasement;
            return this;
        }
        public Builder setTypeCode(List<String> typeCode) {
            this.typeCode = typeCode;
            return this;
        }
        public Builder setManagerName(String managerName) {
            this.managerName = managerName;
            return this;
        }
        public Builder setManagerPhone(String managerPhone) {  // ĐÃ SỬA
            this.managerPhone = managerPhone;
            return this;
        }
        public Builder setAreaFrom(Long areaFrom) {
            this.areaFrom = areaFrom;
            return this;
        }
        public Builder setAreaTo(Long areaTo) {
            this.areaTo = areaTo;
            return this;
        }
        public Builder setRentPriceFrom(Long rentPriceFrom) {
            this.rentPriceFrom = rentPriceFrom;
            return this;
        }
        public Builder setRentPriceTo(Long rentPriceTo) {
            this.rentPriceTo = rentPriceTo;
            return this;
        }
        public Builder setStaffId(Long staffId) {
            this.staffId = staffId;
            return this;
        }
        public Builder setDirection(String direction) {  // ĐÃ THÊM
            this.direction = direction;
            return this;
        }
        public Builder setLevel(Long level) {            // ĐÃ THÊM
            this.level = level;
            return this;
        }
        public BuildingSearchBuilder build() {
            return new BuildingSearchBuilder(this);
        }
    }
}