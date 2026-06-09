package com.javaweb.entity;

import com.javaweb.enums.BuildingStatus;
import com.javaweb.enums.LegalStatus;
import com.javaweb.enums.TransactionType;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "building")
public class BuildingEntity extends BaseEntity {

    private static final long serialVersionUID = -4988455421375043688L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "street")
    private String street;

    @Column(name = "province_code")
    private String provinceCode;

    @Column(name = "province_name")
    private String provinceName;

    @Column(name = "ward_code")
    private String wardCode;

    @Column(name = "ward_name")
    private String wardName;

    // ============ GIỮ LẠI FIELD CŨ ĐỂ MIGRATION ============
    @Column(name = "ward_legacy")
    private String wardLegacy;

    @Column(name = "district_legacy")
    private String districtLegacy;

    @Column(name = "structure")
    private String structure;

    @Column(name = "numberofbasement")
    private Integer numberOfBasement;

    // ============ ĐÃ ĐỔI TỪ Integer SANG Double ============
    @Column(name = "floorarea")
    private Double floorArea;
    // ============ END ============

    @Column(name = "direction")
    private String direction;

    @Column(name = "level")
    private String level;

    // ============ ĐÃ ĐỔI TỪ Integer SANG Double ============
    @Column(name = "rentprice")
    private Double rentPrice;
    // ============ END ============

    @Column(name = "rentpricedescription", columnDefinition = "TEXT")
    private String rentPriceDescription;

    // ============ ĐÃ ĐỔI TỪ String SANG Double ============
    @Column(name = "servicefee")
    private Double serviceFee;

    @Column(name = "carfee")
    private Double carFee;

    @Column(name = "motofee")
    private Double motoFee;

    @Column(name = "overtimefee")
    private Double overtimeFee;

    @Column(name = "waterfee")
    private Double waterFee;

    @Column(name = "electricityfee")
    private Double electricityFee;
    // ============ END ============

    @Column(name = "deposit")
    private String deposit;

    @Column(name = "payment")
    private String payment;

    @Column(name = "renttime")
    private String rentTime;

    @Column(name = "decorationtime")
    private String decorationTime;

    @Column(name = "brokeragefee")
    private Double brokerageFee;

    // ============ ĐÃ ĐỔI TỪ type THÀNH propertyType ============
    @Column(name = "type")  // Vẫn map với cột "type" trong database
    private String propertyType;  // Ví dụ: "TANG_TRET,NGUYEN_CAN"
    // ============ END ============

    @Column(name = "note")
    private String note;

    @Column(name = "linkofbuilding")
    private String linkOfBuilding;

    @Column(name = "map")
    private String map;

    @Column(name = "avatar", columnDefinition = "TEXT")
    private String avatar;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    // ============ CÁC FIELD MỚI ============
    @Column(name = "price_sale")
    private Double priceSale;

    @Column(name = "price_rent")
    private Double priceRent;

    // ============ ĐÃ ĐỔI TỪ String SANG Enum TransactionType ============
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type")
    private TransactionType transactionType;
    // ============ END ============

    @Column(name = "managername")
    private String managerName;

    @Column(name = "managerphone")
    private String managerPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "legal")
    private LegalStatus legal;

    // ── THÊM VÀO BuildingEntity.java ─────────────────────────────────────────────
// Thêm import:
// import com.javaweb.enums.BuildingStatus;

    // Thêm field (sau field "legal"):
    @Enumerated(EnumType.STRING)
    @Column(name = "building_status")
    private BuildingStatus buildingStatus = BuildingStatus.AVAILABLE;
    @Column(name = "rent_start_date")
    private LocalDate rentStartDate;   // Ngày bắt đầu thuê (set khi SIGNED → PAID)

    @Column(name = "rent_end_date")
    private LocalDate rentEndDate;     // Ngày kết thúc thuê (rentStartDate + contractMonths)
    // Scheduled Job kiểm tra hàng ngày

    // Thêm getters & setters:
    public LocalDate getRentStartDate() { return rentStartDate; }
    public void setRentStartDate(LocalDate rentStartDate) { this.rentStartDate = rentStartDate; }

    public LocalDate getRentEndDate() { return rentEndDate; }
    public void setRentEndDate(LocalDate rentEndDate) { this.rentEndDate = rentEndDate; }

    // Thêm getter & setter:
    public BuildingStatus getBuildingStatus() { return buildingStatus; }
    public void setBuildingStatus(BuildingStatus buildingStatus) { this.buildingStatus = buildingStatus; }

    // Quan hệ ManyToMany với UserEntity (staffs)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "assignmentbuilding",
            joinColumns = @JoinColumn(name = "buildingid", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "staffid", nullable = false))
    private List<UserEntity> users = new ArrayList<>();

    // Quan hệ OneToMany với AssignmentBuildingEntity
    @OneToMany(mappedBy = "building", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AssignmentBuildingEntity> assignmentBuildings = new ArrayList<>();

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RentAreaEntity> rentAreas = new ArrayList<>();

    // Constructors
    public BuildingEntity() {}

    public BuildingEntity(Long id) {
        this.id = id;
    }

    // ============ GETTERS AND SETTERS ============

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

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
    }

    public String getWardLegacy() {
        return wardLegacy;
    }

    public void setWardLegacy(String wardLegacy) {
        this.wardLegacy = wardLegacy;
    }

    public String getDistrictLegacy() {
        return districtLegacy;
    }

    public void setDistrictLegacy(String districtLegacy) {
        this.districtLegacy = districtLegacy;
    }

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (street != null && !street.isEmpty()) {
            sb.append(street);
        }
        if (wardName != null && !wardName.isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(wardName);
        }
        if (provinceName != null && !provinceName.isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(provinceName);
        }
        return sb.toString();
    }

    public String getStructure() {
        return structure;
    }

    public void setStructure(String structure) {
        this.structure = structure;
    }

    public Integer getNumberOfBasement() {
        return numberOfBasement;
    }

    public void setNumberOfBasement(Integer numberOfBasement) {
        this.numberOfBasement = numberOfBasement;
    }

    public Double getFloorArea() {
        return floorArea;
    }

    public void setFloorArea(Double floorArea) {
        this.floorArea = floorArea;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Double getRentPrice() {
        return rentPrice;
    }

    public void setRentPrice(Double rentPrice) {
        this.rentPrice = rentPrice;
    }

    public String getRentPriceDescription() {
        return rentPriceDescription;
    }

    public void setRentPriceDescription(String rentPriceDescription) {
        this.rentPriceDescription = rentPriceDescription;
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

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
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

    public LegalStatus getLegal() {
        return legal;
    }

    public void setLegal(LegalStatus legal) {
        this.legal = legal;
    }

    public List<UserEntity> getUsers() {
        return users;
    }

    public void setUsers(List<UserEntity> users) {
        this.users = users;
    }

    public List<AssignmentBuildingEntity> getAssignmentBuildings() {
        return assignmentBuildings;
    }

    public void setAssignmentBuildings(List<AssignmentBuildingEntity> assignmentBuildings) {
        this.assignmentBuildings = assignmentBuildings;
    }

    public List<RentAreaEntity> getRentAreas() {
        return rentAreas;
    }

    public void setRentAreas(List<RentAreaEntity> rentAreas) {
        this.rentAreas = rentAreas;
    }
}
