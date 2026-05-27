package com.javaweb.service.impl;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.model.request.CustomerMatchingRequest;
import com.javaweb.model.response.BuildingMatchingResult;
import com.javaweb.model.response.CustomerMatchingResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.service.CustomerBuildingMatchingService;
import com.javaweb.utils.MatchingScoreCalculator;
import com.javaweb.utils.MatchingWeight;
import com.javaweb.service.WardLocationScorer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerBuildingMatchingServiceImpl implements CustomerBuildingMatchingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired(required = false)
    private CustomerRepository customerRepository; // optional: load demand từ DB
    @Autowired
    private WardLocationScorer wardLocationScorer;

    // ── Public entry point ───────────────────────────────────────────────────

    @Override
    public CustomerMatchingResponse findMatchingBuildings(CustomerMatchingRequest request) {

        // 1. Resolve demand (từ request trực tiếp hoặc load từ DB qua customerId)
        MatchingDemand demand = resolveDemand(request);

        // 2. Lấy trọng số theo priorityType
        MatchingWeight weight = MatchingWeight.of(demand.priorityType);

        // 3. Lấy toàn bộ building active
        List<BuildingEntity> allBuildings = buildingRepository.findAll();

        // 4. Tính điểm cho từng building, lọc & sắp xếp
        List<BuildingMatchingResult> results = allBuildings.stream()
                .map(b -> calculateResult(b, demand, weight))
                .filter(r -> r.getTotalScore() >= request.getMinScore())
                .filter(r -> r.getScoreType() > 0) // hard filter: type phải khớp
                .sorted(Comparator.comparingDouble(BuildingMatchingResult::getTotalScore).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        // 5. Đóng gói response
        CustomerMatchingResponse response = new CustomerMatchingResponse();
        response.setCustomerId(request.getCustomerId());
        response.setPriorityType(demand.priorityType != null ? demand.priorityType.name() : CustomerPriorityType.DEFAULT.name());
        response.setTotalFound(results.size());
        response.setResults(results);
        return response;
    }

    // ── Tính điểm cho một building ──────────────────────────────────────────

    private BuildingMatchingResult calculateResult(
            BuildingEntity building,
            MatchingDemand demand,
            MatchingWeight weight) {

        // Chọn giá phù hợp với transactionType (RENT/SALE)
        Double buildingPrice = resolvePrice(building, demand);

        // Dùng WardLocationScorer — dựa trên bảng ward_adjacency từ GeoJSON 33 tỉnh
        double sLocation = wardLocationScorer.score(building.getWardCode(), demand.ward);

        double sPrice = MatchingScoreCalculator.scorePrince(buildingPrice, demand.price);

        double sArea  = MatchingScoreCalculator.scoreArea(building.getFloorArea(), demand.area);

        double sType  = MatchingScoreCalculator.scoreType(building.getPropertyType(), demand.propertyType);

        double total  = MatchingScoreCalculator.totalScore(weight, sLocation, sPrice, sArea, sType);

        // Đóng gói kết quả
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
     * Resolve demand: ưu tiên field trong request,
     * nếu thiếu thì thử load từ CustomerEntity (nếu customerId có và DB có).
     */
    private MatchingDemand resolveDemand(CustomerMatchingRequest request) {
        MatchingDemand demand = new MatchingDemand();
        demand.area         = request.getDemandArea();
        demand.price        = request.getDemandPrice();
        demand.ward         = request.getDemandWard();
        demand.province     = request.getDemandProvince();
        demand.propertyType = request.getDemandPropertyType();
        demand.priorityType = request.getPriorityType();

        // Nếu request thiếu thông tin, thử load từ DB
        if (request.getCustomerId() != null && customerRepository != null) {
            customerRepository.findById(request.getCustomerId()).ifPresent(customer -> {
                // CustomerEntity.demand hiện là String → bạn có thể parse JSON ở đây
                // Tạm thời chỉ lấy priorityType nếu request chưa có
                // (Mở rộng: dùng ObjectMapper để parse demand JSON sang Demand object)
            });
        }

        // Default priorityType
        if (demand.priorityType == null) {
            demand.priorityType = CustomerPriorityType.DEFAULT;
        }

        return demand;
    }

    /**
     * Chọn giá building phù hợp với loại giao dịch của demand.
     * Nếu demand không chỉ định → dùng priceRent (phổ biến nhất).
     */
    private Double resolvePrice(BuildingEntity building, MatchingDemand demand) {
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