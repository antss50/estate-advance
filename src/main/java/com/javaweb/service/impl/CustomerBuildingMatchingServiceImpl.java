package com.javaweb.service.impl;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.Demand;
import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.model.request.CustomerMatchingRequest;
import com.javaweb.model.response.BuildingMatchingResult;
import com.javaweb.model.response.CustomerMatchingResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.service.CustomerBuildingMatchingService;
import com.javaweb.util.MatchingScoreCalculator;
import com.javaweb.util.MatchingWeight;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerBuildingMatchingServiceImpl implements CustomerBuildingMatchingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // ── Public entry point ───────────────────────────────────────────────────

    @Override
    public CustomerMatchingResponse findMatchingBuildings(CustomerMatchingRequest request) {

        // 1. Load CustomerEntity từ DB — bắt buộc vì khách đã có tài khoản
        CustomerEntity customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng với id: " + request.getCustomerId()));

        // 2. Build MatchingDemand từ entity + override (nếu có)
        MatchingDemand demand = buildDemand(customer, request);

        // 3. Lấy trọng số theo priorityType của khách
        MatchingWeight weight = MatchingWeight.of(demand.priorityType);

        // 4. Lấy toàn bộ building, tính điểm, lọc & sắp xếp
        List<BuildingEntity> allBuildings = buildingRepository.findAll();

        List<BuildingMatchingResult> results = allBuildings.stream()
                .map(b -> calculateResult(b, demand, weight))
                .filter(r -> r.getScoreType() > 0)               // hard filter: loại nhà phải khớp
                .filter(r -> r.getTotalScore() >= request.getMinScore())
                .sorted(Comparator.comparingDouble(BuildingMatchingResult::getTotalScore).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        // 5. Đóng gói response
        CustomerMatchingResponse response = new CustomerMatchingResponse();
        response.setCustomerId(customer.getId());
        response.setCustomerName(customer.getFullName());
        response.setPriorityType(demand.priorityType.name());
        response.setTotalFound(results.size());
        response.setResults(results);
        return response;
    }

    // ── Build MatchingDemand từ CustomerEntity ──────────────────────────────

    /**
     * Lấy demand từ CustomerEntity (đã lưu trong DB).
     * Nếu request có override field → dùng override thay thế.
     *
     * Thứ tự ưu tiên: override trong request > demand trong DB > default
     */
    private MatchingDemand buildDemand(CustomerEntity customer, CustomerMatchingRequest request) {
        Demand dbDemand = customer.getDemand(); // @Embedded từ bảng customer

        MatchingDemand demand = new MatchingDemand();

        // Area
        demand.area = request.getOverrideArea() != null
                ? request.getOverrideArea()
                : (dbDemand != null ? dbDemand.getArea() : null);

        // Price
        demand.price = request.getOverridePrice() != null
                ? request.getOverridePrice()
                : (dbDemand != null ? dbDemand.getPrice() : null);

        // Ward
        demand.ward = request.getOverrideWard() != null
                ? request.getOverrideWard()
                : (dbDemand != null ? dbDemand.getWard() : null);

        // Province
        demand.province = request.getOverrideProvince() != null
                ? request.getOverrideProvince()
                : (dbDemand != null ? dbDemand.getProvince() : null);

        // PropertyType
        demand.propertyType = request.getOverridePropertyType() != null
                ? request.getOverridePropertyType()
                : (dbDemand != null ? dbDemand.getPropertyType() : null);

        // PriorityType — luôn lấy từ DB (do khách tự thiết lập khi đăng ký/cập nhật)
        demand.priorityType = (dbDemand != null && dbDemand.getPriorityType() != null)
                ? dbDemand.getPriorityType()
                : CustomerPriorityType.DEFAULT;

        return demand;
    }

    // ── Tính điểm cho một building ──────────────────────────────────────────

    private BuildingMatchingResult calculateResult(
            BuildingEntity building,
            MatchingDemand demand,
            MatchingWeight weight) {

        Double buildingPrice = resolvePrice(building);

        double sLocation = MatchingScoreCalculator.scoreLocation(
                building.getWardCode(), building.getWardName(),
                building.getProvinceCode(), building.getProvinceName(),
                demand.ward, demand.province);

        double sPrice = MatchingScoreCalculator.scorePrince(buildingPrice, demand.price);

        double sArea  = MatchingScoreCalculator.scoreArea(building.getFloorArea(), demand.area);

        double sType  = MatchingScoreCalculator.scoreType(building.getPropertyType(), demand.propertyType);

        double total  = MatchingScoreCalculator.totalScore(weight, sLocation, sPrice, sArea, sType);

        BuildingMatchingResult result = new BuildingMatchingResult();
        result.setBuildingId(building.getId());
        result.setBuildingName(building.getName());
        result.setAddress(building.getFullAddress());
        result.setPropertyType(building.getPropertyType());
        result.setPriceRent(building.getPriceRent());
        result.setPriceSale(building.getPriceSale());
        result.setFloorArea(building.getFloorArea());
        result.setScoreLocation(round(sLocation));
        result.setScorePrice(round(sPrice));
        result.setScoreArea(round(sArea));
        result.setScoreType(sType);
        result.setTotalScore(round(total));
        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Chọn giá building theo transactionType: RENT → priceRent, SALE → priceSale.
     */
    private Double resolvePrice(BuildingEntity building) {
        if (building.getTransactionType() == null) return building.getPriceRent();
        switch (building.getTransactionType()) {
            case SALE: return building.getPriceSale();
            case RENT:
            default:   return building.getPriceRent();
        }
    }

    private double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    // ── Inner DTO (nội bộ service) ───────────────────────────────────────────

    private static class MatchingDemand {
        Double area;
        Double price;
        String ward;
        String province;
        String propertyType;
        CustomerPriorityType priorityType;
    }
}