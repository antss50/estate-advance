package com.javaweb.model.dto;

import com.javaweb.enums.LegalStatus;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class BuildingDTO extends AbstractDTO {
    private String name;

    // ============ ĐỊA CHỈ MỚI SAU SÁP NHẬP ============
    private String street;
    private String provinceCode;
    private String provinceName;
    private String wardCode;
    private String wardName;      // Tên phường/xã
    private String ward;          // Giữ lại cho tương thích (map từ wardName)
    // ============ END ============

    // ============ GIỮ LẠI FIELD CŨ CHO MIGRATION ============
    private String district;       // Giữ nhưng có thể null
    // ============ END ============

    private String structure;
    private Integer floorArea;
    private String rentArea;

    // ============ GIÁ (HỖ TRỢ CẢ MUA VÀ THUÊ) ============
    private Integer rentPrice;      // Giá thuê cũ (giữ lại)
    private Double priceSale;       // Giá bán
    private Double priceRent;       // Giá thuê mới
    private String transactionType; // "SALE", "RENT", "BOTH"
    // ============ END ============

    private Integer numberOfBasement;
    private String direction;
    private String rentPriceDescription;
    private String level;
    private String managerName;
    private String managerPhone;
    private String serviceFee;
    private String carFee;
    private String motoFee;
    private String overtimeFee;
    private String waterFee;
    private String electricityFee;
    private String deposit;
    private String payment;
    private String rentTime;
    private String decorationTime;
    private Double brokerageFee;
    private String note;
    private String linkOfBuilding;
    private String map;

    // THÊM FIELD AVATAR VÀ IMAGE
    private String avatar;      // Lưu đường dẫn avatar (1 ảnh)
    private String image;       // Lưu đường dẫn images (nhiều ảnh)

    private LegalStatus legal;
    private String[] typeCode;   // Mảng type code
    private Long staffId;

    // Thêm 2 field để nhận file upload
    private MultipartFile avatarFile;      // File avatar (1 ảnh)
    private List<MultipartFile> imageFiles; // Danh sách file images (nhiều ảnh)

    // ============ GETTERS AND SETTERS ============

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Địa chỉ mới
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public String getWardCode() {
        return wardCode;
    }

    public void setWardCode(String wardCode) {
        this.wardCode = wardCode;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
        this.ward = wardName; // Đồng bộ với field ward cũ
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
        if (this.wardName == null) {
            this.wardName = ward;
        }
    }

    // Field cũ (migration)
    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    // Giá
    public Integer getRentPrice() {
        return rentPrice;
    }

    public void setRentPrice(Integer rentPrice) {
        this.rentPrice = rentPrice;
    }

    public Double getPriceSale() {
        return priceSale;
    }

    public void setPriceSale(Double priceSale) {
        this.priceSale = priceSale;
    }

    public Double getPriceRent() {
        return priceRent;
    }

    public void setPriceRent(Double priceRent) {
        this.priceRent = priceRent;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getStructure() {
        return structure;
    }

    public void setStructure(String structure) {
        this.structure = structure;
    }

    public Integer getFloorArea() {
        return floorArea;
    }

    public void setFloorArea(Integer floorArea) {
        this.floorArea = floorArea;
    }

    public String getRentArea() {
        return rentArea;
    }

    public void setRentArea(String rentArea) {
        this.rentArea = rentArea;
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

    public String getRentPriceDescription() {
        return rentPriceDescription;
    }

    public void setRentPriceDescription(String rentPriceDescription) {
        this.rentPriceDescription = rentPriceDescription;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getManagerPhone() {
        return managerPhone;
    }

    public void setManagerPhone(String managerPhone) {
        this.managerPhone = managerPhone;
    }

    public String getServiceFee() {
        return serviceFee;
    }

    public void setServiceFee(String serviceFee) {
        this.serviceFee = serviceFee;
    }

    public String getCarFee() {
        return carFee;
    }

    public void setCarFee(String carFee) {
        this.carFee = carFee;
    }

    public String getMotoFee() {
        return motoFee;
    }

    public void setMotoFee(String motoFee) {
        this.motoFee = motoFee;
    }

    public String getOvertimeFee() {
        return overtimeFee;
    }

    public void setOvertimeFee(String overtimeFee) {
        this.overtimeFee = overtimeFee;
    }

    public String getWaterFee() {
        return waterFee;
    }

    public void setWaterFee(String waterFee) {
        this.waterFee = waterFee;
    }

    public String getElectricityFee() {
        return electricityFee;
    }

    public void setElectricityFee(String electricityFee) {
        this.electricityFee = electricityFee;
    }

    public String getDeposit() {
        return deposit;
    }

    public void setDeposit(String deposit) {
        this.deposit = deposit;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

    public String getRentTime() {
        return rentTime;
    }

    public void setRentTime(String rentTime) {
        this.rentTime = rentTime;
    }

    public String getDecorationTime() {
        return decorationTime;
    }

    public void setDecorationTime(String decorationTime) {
        this.decorationTime = decorationTime;
    }

    public Double getBrokerageFee() {
        return brokerageFee;
    }

    public void setBrokerageFee(Double brokerageFee) {
        this.brokerageFee = brokerageFee;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getLinkOfBuilding() {
        return linkOfBuilding;
    }

    public void setLinkOfBuilding(String linkOfBuilding) {
        this.linkOfBuilding = linkOfBuilding;
    }

    public String getMap() {
        return map;
    }

    public void setMap(String map) {
        this.map = map;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LegalStatus getLegal() {
        return legal;
    }

    public void setLegal(LegalStatus legal) {
        this.legal = legal;
    }

    public String[] getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String[] typeCode) {
        this.typeCode = typeCode;
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public MultipartFile getAvatarFile() {
        return avatarFile;
    }

    public void setAvatarFile(MultipartFile avatarFile) {
        this.avatarFile = avatarFile;
    }

    public List<MultipartFile> getImageFiles() {
        return imageFiles;
    }

    public void setImageFiles(List<MultipartFile> imageFiles) {
        this.imageFiles = imageFiles;
    }
}