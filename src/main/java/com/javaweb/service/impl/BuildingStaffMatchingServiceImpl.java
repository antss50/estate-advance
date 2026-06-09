package com.javaweb.service.impl;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.request.BuildingStaffMatchingRequest;
import com.javaweb.model.response.BuildingStaffMatchingResponse;
import com.javaweb.model.response.BuildingStaffMatchingResult;
import com.javaweb.repository.AssignmentCustomerRepository;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.BuildingStaffMatchingService;
import com.javaweb.service.WardLocationScorer;
import com.javaweb.utils.BuildingScoreCalculator;
import com.javaweb.utils.BuildingStaffScoreCalculator;
import com.javaweb.utils.StaffMatchingScoreCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class BuildingStaffMatchingServiceImpl implements BuildingStaffMatchingService {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssignmentCustomerRepository assignmentCustomerRepository;

    @Autowired
    private WardLocationScorer wardLocationScorer;

    @Override
    public BuildingStaffMatchingResponse findMatchingStaff(BuildingStaffMatchingRequest request) {

        // 1. Load Building
        BuildingEntity building = buildingRepository
                .findById(request.getBuildingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy building id: " + request.getBuildingId()));

        // 2. Tính Score_Building (độ khó)
        double sPrice     = BuildingScoreCalculator.scorePrice(
                resolvePrice(building), building.getTransactionType());
        double sLegal     = BuildingScoreCalculator.scoreLegal(building.getLegal());
        double sLiquidity = BuildingScoreCalculator.scoreLiquidity(request.getMonthsInInventory());
        double scoreBuilding = BuildingScoreCalculator.totalScore(sPrice, sLegal, sLiquidity);

        // 3. Lấy tất cả staff active
        List<UserEntity> activeStaffs = userRepository.findByStatus(1);

        // 4. Tính Score_BS cho từng staff → sắp xếp → top N
        List<BuildingStaffMatchingResult> results = activeStaffs.stream()
                .map(staff -> calculateResult(staff, building, scoreBuilding,
                        sPrice, sLegal, sLiquidity, request))
                .sorted(Comparator.comparingDouble(BuildingStaffMatchingResult::getTotalScoreBS).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        // 5. Đóng gói response
        BuildingStaffMatchingResponse response = new BuildingStaffMatchingResponse();
        response.setBuildingId(building.getId());
        response.setBuildingName(building.getName());
        response.setBuildingAddress(building.getFullAddress());
        response.setScoreBuilding(BuildingStaffScoreCalculator.round(scoreBuilding));
        response.setTotalFound(results.size());
        response.setResults(results);
        return response;
    }

    // ── Tính điểm cho một staff ──────────────────────────────────────────────

    private BuildingStaffMatchingResult calculateResult(
            UserEntity staff,
            BuildingEntity building,
            double scoreBuilding,
            double sPrice,
            double sLegal,
            double sLiquidity,
            BuildingStaffMatchingRequest request) {

        int daysWorked = calcDaysWorked(staff);
        boolean isNewbie = daysWorked < request.getProbationDays();

        // ── S_Area: địa bàn của staff vs ward của building ────────────────────
        // workingArea có thể là nhiều tên phường CSV: "Phường Bến Nghé,Bến Nghé"
        // Lấy score cao nhất trong tất cả ward của staff
        double sArea = scoreBestWorkingArea(staff.getWorkingArea(), building.getWardName());

        // ── S_Performance ─────────────────────────────────────────────────────
        double sPerformance = StaffMatchingScoreCalculator.scorePerformance(
                staff.getRevenue(),
                staff.getTotalDeals(),
                request.getPTarget());

        // ── S_Workload ────────────────────────────────────────────────────────
        int currentLoad = (int) assignmentCustomerRepository.countByStaff_Id(staff.getId());
        double sWorkload = StaffMatchingScoreCalculator.scoreWorkload(
                currentLoad, request.getLMax());

        // ── Newbie Bonus ──────────────────────────────────────────────────────
        double bonus = isNewbie
                ? StaffMatchingScoreCalculator.newbieBonus(daysWorked, request.getProbationDays())
                : 0.0;

        // ── Score_BS tổng hợp ─────────────────────────────────────────────────
        // S_Area nhân vào scoreBuilding: staff sai địa bàn → điểm building bị giảm
        double totalBS = BuildingStaffScoreCalculator.totalScoreBS(sArea, sPerformance, sWorkload, bonus);

        // ── Đóng gói kết quả ──────────────────────────────────────────────────
        BuildingStaffMatchingResult result = new BuildingStaffMatchingResult();
        result.setStaffId(staff.getId());
        result.setStaffName(staff.getFullName());
        result.setEmail(staff.getEmail());
        result.setPhone(staff.getPhone());
        result.setWorkingArea(staff.getWorkingArea());

        result.setScoreBuilding(BuildingStaffScoreCalculator.round(scoreBuilding));
        result.setScoreBuildingPrice(BuildingStaffScoreCalculator.round(sPrice));
        result.setScoreBuildingLegal(BuildingStaffScoreCalculator.round(sLegal));
        result.setScoreBuildingLiquidity(BuildingStaffScoreCalculator.round(sLiquidity));

        result.setScoreArea(BuildingStaffScoreCalculator.round(sArea));
        result.setScorePerformance(BuildingStaffScoreCalculator.round(sPerformance));
        result.setScoreWorkload(BuildingStaffScoreCalculator.round(sWorkload));
        result.setNewbieBonus(BuildingStaffScoreCalculator.round(bonus));
        result.setTotalScoreBS(BuildingStaffScoreCalculator.round(totalBS));

        result.setCurrentLoad(currentLoad);
        result.setNewbie(isNewbie);
        result.setDaysWorked(daysWorked);
        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * workingArea của staff là CSV tên phường: "Phường Bến Nghé,Bến Nghé".
     * Lấy score cao nhất trong tất cả ward → staff phủ nhiều phường có lợi thế.
     */
    private double scoreBestWorkingArea(String workingArea, String buildingWardName) {
        if (workingArea == null || workingArea.trim().isEmpty()) return 0.2;
        if (buildingWardName == null || buildingWardName.trim().isEmpty()) return 1.0;

        double best = 0.2;
        for (String staffWard : workingArea.split(",")) {
            double score = wardLocationScorer.score(staffWard.trim(), buildingWardName);
            if (score > best) best = score;
            if (best == 1.0) break; // không thể cao hơn
        }
        return best;
    }

    /**
     * Chọn giá building theo transactionType để tính Score_Price.
     */
    private Double resolvePrice(BuildingEntity building) {
        if (building.getTransactionType() == null) return building.getPriceRent();
        switch (building.getTransactionType()) {
            case SALE: return building.getPriceSale();
            case RENT:
            default:   return building.getPriceRent();
        }
    }

    /**
     * Tính số ngày đã đi làm từ createdDate trong BaseEntity.
     * Nếu không có → coi là nhân viên cũ (không có bonus).
     */
    private int calcDaysWorked(UserEntity staff) {
        Date onboardDate = staff.getCreatedDate();
        if (onboardDate == null) return Integer.MAX_VALUE;
        long diffMs = new Date().getTime() - onboardDate.getTime();
        return (int) TimeUnit.MILLISECONDS.toDays(diffMs);
    }
}
