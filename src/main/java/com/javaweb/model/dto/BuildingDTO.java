package com.javaweb.model.dto;

import com.javaweb.enums.LegalStatus;
import com.javaweb.enums.TransactionType;
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
    private Double floorArea;
    private String rentArea;

    // ============ GIÁ (HỖ TRỢ CẢ MUA VÀ THUÊ) ============
    private Double rentPrice;
    private Double priceSale;
    private Double priceRent;
    private TransactionType transactionType;
    // ============ END ============

    private Integer numberOfBasement;
    private String direction;
    private String rentPriceDescription;
    private String level;
    private String managerName;
    private String managerPhone;

    // ============ CÁC LOẠI PHÍ ============
    private Double serviceFee;
    private Double carFee;
    private Double motoFee;
    private Double overtimeFee;
    private Double waterFee;
    private Double electricityFee;
    // ============ END ============

    private String deposit;
    private String payment;
    private String rentTime;
    private String decorationTime;
    private Double brokerageFee;
    private String note;
    private String linkOfBuilding;
    private String map;

    // THÊM FIELD AVATAR VÀ IMAGE
    private String avatar;
    private String image;

    private LegalStatus legal;

    // ============ PROPERTY TYPE (THAY THẾ typeCode) ============
    private String propertyType;
    // ============ END ============

    private Long staffId;

    // Thêm 2 field để nhận file upload
    private MultipartFile avatarFile;
    private List<MultipartFile> imageFiles;

    // ============ CONSTRUCTORS ============
    public BuildingDTO() {}

    // ============ GETTERS AND SETTERS ============

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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
        this.ward = wardName;
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

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getStructure() {
        return structure;
    }

    public void setStructure(String structure) {
        this.structure = structure;
    }

    public Double getFloorArea() {
        return floorArea;
    }

    public void setFloorArea(Double floorArea) {
        this.floorArea = floorArea;
    }

    public String getRentArea() {
        return rentArea;
    }

    public void setRentArea(String rentArea) {
        this.rentArea = rentArea;
    }

    public Double getRentPrice() {
        return rentPrice;
    }

    public void setRentPrice(Double rentPrice) {
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

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
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

    public Double getServiceFee() {
        return serviceFee;
    }

    public void setServiceFee(Double serviceFee) {
        this.serviceFee = serviceFee;
    }

    public Double getCarFee() {
        return carFee;
    }

    public void setCarFee(Double carFee) {
        this.carFee = carFee;
    }

    public Double getMotoFee() {
        return motoFee;
    }

    public void setMotoFee(Double motoFee) {
        this.motoFee = motoFee;
    }

    public Double getOvertimeFee() {
        return overtimeFee;
    }

    public void setOvertimeFee(Double overtimeFee) {
        this.overtimeFee = overtimeFee;
    }

    public Double getWaterFee() {
        return waterFee;
    }

    public void setWaterFee(Double waterFee) {
        this.waterFee = waterFee;
    }

    public Double getElectricityFee() {
        return electricityFee;
    }

    public void setElectricityFee(Double electricityFee) {
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

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
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

    // ============ PHƯƠNG THỨC TƯƠNG THÍCH VỚI CODE CŨ ============

    /**
     * Chuyển đổi từ String[] (cách dùng cũ) sang propertyType
     * Ví dụ: ["OFFICE", "RETAIL"] -> "OFFICE,RETAIL"
     */
    public void setTypeCode(String[] typeCode) {
        if (typeCode != null && typeCode.length > 0) {
            this.propertyType = String.join(",", typeCode);
        }
    }

    /**
     * Lấy typeCode dưới dạng mảng (tương thích ngược)
     */
    public String[] getTypeCode() {
        if (propertyType != null && !propertyType.isEmpty()) {
            return propertyType.split(",");
        }
        return null;
    }

    // ============ END PHƯƠNG THỨC TƯƠNG THÍCH ============
}