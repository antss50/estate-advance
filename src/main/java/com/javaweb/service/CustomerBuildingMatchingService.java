package com.javaweb.service;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.enums.TypeCode;
import com.javaweb.model.request.CustomerMatchingRequest;
import com.javaweb.model.response.BuildingMatchScore;
import com.javaweb.model.response.CustomerMatchingResponse;
import com.javaweb.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomerBuildingMatchingService {

    @Autowired
    private BuildingRepository buildingRepository;

    // Map các phường/xã lân cận
    private static final Map<String, List<String>> NEIGHBORING_WARDS = new HashMap<>();

    static {
        NEIGHBORING_WARDS.put("Phường Bến Nghé", Arrays.asList("Phường Bến Thành", "Phường Cầu Kho", "Phường Đa Kao"));
        NEIGHBORING_WARDS.put("Phường Bến Thành", Arrays.asList("Phường Bến Nghé", "Phường Cầu Kho", "Phường Tân Định"));
        NEIGHBORING_WARDS.put("Phường Cầu Kho", Arrays.asList("Phường Bến Nghé", "Phường Bến Thành"));
        NEIGHBORING_WARDS.put("Phường An Phú", Arrays.asList("Phường Bình An", "Phường An Khánh"));
        NEIGHBORING_WARDS.put("Phường Bình An", Arrays.asList("Phường An Phú", "Phường An Khánh"));
        NEIGHBORING_WARDS.put("Phường Phúc Xá", Arrays.asList("Phường Trúc Bạch", "Phường Vĩnh Phúc"));
        NEIGHBORING_WARDS.put("Phường Trúc Bạch", Arrays.asList("Phường Phúc Xá", "Phường Cống Vị"));
        NEIGHBORING_WARDS.put("Phường Hàng Mã", Arrays.asList("Phường Đồng Xuân", "Phường Hàng Buồm"));
        NEIGHBORING_WARDS.put("Phường Hàng Bạc", Arrays.asList("Phường Hàng Đào", "Phường Hàng Trống"));
    }

    public CustomerMatchingResponse findMatchingBuildings(CustomerMatchingRequest request) {
        List<BuildingEntity> allBuildings = buildingRepository.findAll();

        List<BuildingMatchScore> scores = allBuildings.stream()
                .map(building -> calculateMatchScore(building, request))
                .filter(score -> score.getTotalScore() > 0)
                .sorted((s1, s2) -> Double.compare(s2.getTotalScore(), s1.getTotalScore()))
                .limit(request.getLimit())
                .collect(Collectors.toList());

        Double desiredPrice = null;
        if ("SALE".equals(request.getTransactionType())) {
            desiredPrice = request.getDesiredPriceSale();
        } else if ("RENT".equals(request.getTransactionType())) {
            desiredPrice = request.getDesiredPriceRent();
        }

        return new CustomerMatchingResponse(
                request.getCustomerId(),
                desiredPrice,
                request.getDesiredArea(),
                request.getDesiredWard(),
                request.getDesiredProvince(),
                request.getPriorityType() != null ? request.getPriorityType().getName() : "Mặc định",
                scores
        );
    }

    private BuildingMatchScore calculateMatchScore(BuildingEntity building, CustomerMatchingRequest request) {
        double priceScore = calculatePriceScore(building, request);
        double areaScore = calculateAreaScore(building, request);
        double locationScore = calculateLocationScore(building, request);
        double typeScore = calculateTypeScore(building, request);

        CustomerPriorityType priorityType = request.getPriorityType();
        if (priorityType == null) {
            priorityType = CustomerPriorityType.DEFAULT;
        }

        double wL = priorityType.getLocationWeight();
        double wG = priorityType.getPriceWeight();
        double wA = priorityType.getAreaWeight();
        double totalWeight = priorityType.getTotalWeight();

        double weightedSum = (wL * locationScore) + (wG * priceScore) + (wA * areaScore);
        double finalScore = (weightedSum / totalWeight) * typeScore;

        Double price = null;
        Double priceSale = building.getPriceSale();
        Double priceRent = building.getPriceRent();

        if ("SALE".equals(request.getTransactionType())) {
            price = priceSale;
        } else if ("RENT".equals(request.getTransactionType())) {
            price = priceRent;
        }

        String address = building.getFullAddress();
        if (address == null || address.isEmpty()) {
            address = (building.getStreet() != null ? building.getStreet() : "") +
                    ", " + (building.getWardName() != null ? building.getWardName() : "") +
                    ", " + (building.getProvinceName() != null ? building.getProvinceName() : "");
        }

        // Lấy tên loại building để hiển thị
        String buildingTypeName = getBuildingTypeDisplayName(building.getType());

        return new BuildingMatchScore(
                building.getId(),
                building.getName(),
                address,
                request.getTransactionType(),
                price,
                priceSale,
                priceRent,
                building.getFloorArea() != null ? building.getFloorArea().doubleValue() : 0.0,
                building.getWardName(),
                building.getProvinceName(),
                buildingTypeName,
                priceScore,
                areaScore,
                locationScore,
                typeScore,
                finalScore
        );
    }

    private double calculatePriceScore(BuildingEntity building, CustomerMatchingRequest request) {
        Double buildingPrice = null;
        Double desiredPrice = null;

        if ("SALE".equals(request.getTransactionType())) {
            buildingPrice = building.getPriceSale();
            desiredPrice = request.getDesiredPriceSale();
        } else if ("RENT".equals(request.getTransactionType())) {
            buildingPrice = building.getPriceRent();
            desiredPrice = request.getDesiredPriceRent();
        } else {
            if (building.getPriceSale() != null && request.getDesiredPriceSale() != null) {
                buildingPrice = building.getPriceSale();
                desiredPrice = request.getDesiredPriceSale();
            } else if (building.getPriceRent() != null && request.getDesiredPriceRent() != null) {
                buildingPrice = building.getPriceRent();
                desiredPrice = request.getDesiredPriceRent();
            } else {
                return 0.5;
            }
        }

        if (desiredPrice == null || desiredPrice <= 0 || buildingPrice == null || buildingPrice <= 0) {
            return 0.5;
        }

        double tolerance = request.getPriceTolerance();
        double diffPercent = Math.abs(buildingPrice - desiredPrice) / (desiredPrice * tolerance);
        double score = Math.max(0, 1 - diffPercent);

        return Math.min(score, 1.0);
    }

    private double calculateAreaScore(BuildingEntity building, CustomerMatchingRequest request) {
        Double buildingArea = building.getFloorArea() != null ? building.getFloorArea().doubleValue() : 0.0;
        Double desiredArea = request.getDesiredArea();
        Double tolerance = request.getAreaTolerance();

        if (desiredArea == null || desiredArea <= 0 || buildingArea <= 0) {
            return 0.5;
        }

        double diffPercent = Math.abs(buildingArea - desiredArea) / (desiredArea * tolerance);
        double score = Math.max(0, 1 - diffPercent);

        return Math.min(score, 1.0);
    }

    private double calculateLocationScore(BuildingEntity building, CustomerMatchingRequest request) {
        String desiredWard = request.getDesiredWard();
        String buildingWard = building.getWardName();

        if (desiredWard == null || desiredWard.isEmpty()) {
            return 1.0;
        }

        if (buildingWard == null || buildingWard.isEmpty()) {
            return 0.2;
        }

        if (buildingWard.equalsIgnoreCase(desiredWard)) {
            return 1.0;
        }

        List<String> neighbors = NEIGHBORING_WARDS.get(desiredWard);
        if (neighbors != null && neighbors.stream().anyMatch(n -> n.equalsIgnoreCase(buildingWard))) {
            return 0.6;
        }

        String desiredProvince = request.getDesiredProvince();
        String buildingProvince = building.getProvinceName();
        if (desiredProvince != null && buildingProvince != null && desiredProvince.equals(buildingProvince)) {
            return 0.4;
        }

        return 0.2;
    }

    /**
     * Tính điểm loại nhà (S_T)
     * Hỗ trợ building có nhiều loại (lưu dạng "TANG_TRET,NGUYEN_CAN")
     */
    private double calculateTypeScore(BuildingEntity building, CustomerMatchingRequest request) {
        String desiredType = request.getBuildingType();
        String buildingTypes = building.getType();

        // Nếu khách hàng không yêu cầu loại cụ thể
        if (desiredType == null || desiredType.isEmpty()) {
            return 1.0;
        }

        // Nếu building chưa có loại
        if (buildingTypes == null || buildingTypes.isEmpty()) {
            return 0.5;
        }

        // Chuyển desiredType từ tên hiển thị sang enum name
        String desiredTypeEnum = convertToEnumName(desiredType);

        // Kiểm tra building có chứa loại mong muốn không
        List<String> buildingTypeList = Arrays.asList(buildingTypes.split(","));
        if (buildingTypeList.contains(desiredTypeEnum)) {
            return 1.0;
        }

        return 0.0;
    }

    /**
     * Chuyển tên hiển thị thành tên enum
     * "Tầng trệt" -> "TANG_TRET"
     * "Nguyên căn" -> "NGUYEN_CAN"
     * "Nội thất" -> "NOI_THAT"
     */
    private String convertToEnumName(String displayName) {
        for (TypeCode type : TypeCode.values()) {
            if (type.getTypeCodeName().equals(displayName)) {
                return type.name();
            }
        }
        return displayName;
    }

    /**
     * Lấy tên hiển thị của loại building
     */
    private String getBuildingTypeDisplayName(String typeCodes) {
        if (typeCodes == null || typeCodes.isEmpty()) {
            return "";
        }

        List<String> typeNames = new ArrayList<>();
        String[] codes = typeCodes.split(",");

        for (String code : codes) {
            for (TypeCode type : TypeCode.values()) {
                if (type.name().equals(code)) {
                    typeNames.add(type.getTypeCodeName());
                    break;
                }
            }
        }

        return String.join(", ", typeNames);
    }
}