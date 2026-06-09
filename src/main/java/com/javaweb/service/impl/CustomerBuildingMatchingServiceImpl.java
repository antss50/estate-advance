package com.javaweb.service.impl;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.DemandEntity;
import com.javaweb.enums.BuildingStatus;
import com.javaweb.enums.CustomerPriorityType;
import com.javaweb.enums.PropertyType;
import com.javaweb.model.request.CustomerMatchingRequest;
import com.javaweb.model.response.BuildingMatchingResult;
import com.javaweb.model.response.CustomerMatchingResponse;
import com.javaweb.repository.AssignmentCustomerRepository;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.service.CustomerBuildingMatchingService;
import com.javaweb.service.WardLocationScorer;
import com.javaweb.utils.MatchingScoreCalculator;
import com.javaweb.utils.MatchingWeight;
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

    @Autowired
    private AssignmentCustomerRepository assignmentCustomerRepository;

    @Autowired
    private WardLocationScorer wardLocationScorer;

    @Override
    public CustomerMatchingResponse findMatchingBuildings(CustomerMatchingRequest request) {

        if (request.getCustomerId() == null) {
            throw new IllegalArgumentException("customerId là bắt buộc");
        }
        CustomerEntity customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng id: " + request.getCustomerId()));

        DemandEntity dbDemand = customer.getCurrentDemand();
        MatchingDemand demand = buildDemand(dbDemand, request);

        MatchingWeight weight = MatchingWeight.of(demand.priorityType);

        List<BuildingEntity> buildings = findCandidateBuildings(request, dbDemand);

        List<BuildingMatchingResult> results = buildings.stream()
                .map(b -> calculateResult(b, demand, weight))
                .filter(r -> r.getScoreType() > 0)
                .filter(r -> r.getTotalScore() >= request.getMinScore())
                .sorted(Comparator.comparingDouble(BuildingMatchingResult::getTotalScore).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        CustomerMatchingResponse response = new CustomerMatchingResponse();
        response.setCustomerId(customer.getId());
        response.setCustomerName(customer.getFullName());
        response.setPriorityType(demand.priorityType.name());
        response.setTotalFound(results.size());
        response.setResults(results);
        return response;
    }

    private MatchingDemand buildDemand(DemandEntity dbDemand, CustomerMatchingRequest request) {
        MatchingDemand demand = new MatchingDemand();

        // Diện tích
        if (request.getDemandArea() != null) {
            demand.area = request.getDemandArea();
        } else if (dbDemand != null) {
            demand.area = dbDemand.getArea();
        }

        // Giá
        if (request.getDemandPrice() != null) {
            demand.price = request.getDemandPrice();
        } else if (dbDemand != null) {
            demand.price = dbDemand.getPrice();
        }

        // Phường/Xã
        if (request.getDemandWard() != null) {
            demand.ward = request.getDemandWard();
        } else if (dbDemand != null) {
            demand.ward = dbDemand.getWard();
        }

        // Tỉnh/Thành phố
        if (request.getDemandProvince() != null) {
            demand.province = request.getDemandProvince();
        } else if (dbDemand != null) {
            demand.province = dbDemand.getProvince();
        }

        // Loại bất động sản
        if (request.getDemandPropertyType() != null) {
            demand.propertyType = request.getDemandPropertyType();
        } else if (dbDemand != null) {
            demand.propertyType = dbDemand.getPropertyType();
        }

        // Mức độ ưu tiên: luôn lấy từ DB (hoặc DEFAULT)
        if (dbDemand != null && dbDemand.getPriorityType() != null) {
            demand.priorityType = dbDemand.getPriorityType();
        } else {
            demand.priorityType = CustomerPriorityType.DEFAULT;
        }

        return demand;
    }

    private List<BuildingEntity> findCandidateBuildings(CustomerMatchingRequest request, DemandEntity dbDemand) {
        Long staffId = resolveStaffScope(request, dbDemand);
        if (staffId != null) {
            return buildingRepository.findByStaffIdAndBuildingStatus(
                    staffId, BuildingStatus.AVAILABLE);
        }
        return buildingRepository.findByBuildingStatus(BuildingStatus.AVAILABLE);
    }

    private Long resolveStaffScope(CustomerMatchingRequest request, DemandEntity dbDemand) {
        if (request.getStaffId() != null) {
            return request.getStaffId();
        }
        if (request.getCustomerId() == null) {
            return null;
        }

        List<Long> staffIds;
        if (dbDemand != null && dbDemand.getId() != null) {
            staffIds = assignmentCustomerRepository.findStaffIdsByCustomerIdAndDemandId(
                    request.getCustomerId(), dbDemand.getId());
            if (staffIds.size() == 1) {
                return staffIds.get(0);
            }
            if (staffIds.size() > 1) {
                throw new IllegalArgumentException("staffId bat buoc khi customer duoc phan cong cho nhieu staff");
            }
        }

        staffIds = assignmentCustomerRepository.findStaffIdsByCustomerId(request.getCustomerId());
        if (staffIds.size() == 1) {
            return staffIds.get(0);
        }
        if (staffIds.size() > 1) {
            throw new IllegalArgumentException("staffId bat buoc khi customer duoc phan cong cho nhieu staff");
        }

        return null;
    }

    private BuildingMatchingResult calculateResult(
            BuildingEntity building,
            MatchingDemand demand,
            MatchingWeight weight) {

        Double buildingPrice = resolvePrice(building);

        double sLocation = wardLocationScorer.score(building.getWardName(), demand.ward);
        double sPrice    = MatchingScoreCalculator.scorePrince(buildingPrice, demand.price);
        double sArea     = MatchingScoreCalculator.scoreArea(building.getFloorArea(), demand.area);
        double sType     = MatchingScoreCalculator.scoreType(building.getPropertyType(), demand.propertyType.getValue());
        double total     = MatchingScoreCalculator.totalScore(weight, sLocation, sPrice, sArea, sType);

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

    private static class MatchingDemand {
        Double area;
        Double price;
        String ward;
        String province;
        PropertyType propertyType;
        CustomerPriorityType priorityType;
    }
}
