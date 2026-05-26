package com.javaweb.service.impl;

import com.javaweb.entity.UserEntity;
import com.javaweb.model.request.StaffMatchingRequest;
import com.javaweb.model.response.StaffMatchingResponse;
import com.javaweb.model.response.StaffMatchingResult;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.StaffMatchingService;
import com.javaweb.util.StaffMatchingScoreCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class StaffMatchingServiceImpl implements StaffMatchingService {

    @Autowired
    private UserRepository userRepository;

    // ── Public entry point ───────────────────────────────────────────────────

    @Override
    public StaffMatchingResponse findMatchingStaff(StaffMatchingRequest request) {

        // 1. Lấy tất cả staff active (status = 1)
        List<UserEntity> activeStaffs = userRepository.findByStatus(1);

        // 2. Tính Score_CS cho từng staff → sắp xếp → lấy top N
        List<StaffMatchingResult> results = activeStaffs.stream()
                .map(staff -> calculateResult(staff, request))
                .sorted(Comparator.comparingDouble(StaffMatchingResult::getTotalScoreCS).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        // 3. Đóng gói response
        StaffMatchingResponse response = new StaffMatchingResponse();
        response.setCustomerId(request.getCustomerId());
        response.setScoreCustomer(request.getScoreCustomer());
        response.setTotalFound(results.size());
        response.setResults(results);
        return response;
    }

    // ── Tính điểm cho một staff ──────────────────────────────────────────────

    private StaffMatchingResult calculateResult(UserEntity staff, StaffMatchingRequest request) {

        // ── Số ngày đã đi làm (t) ────────────────────────────────────────────
        int daysWorked = calcDaysWorked(staff);
        boolean isNewbie = daysWorked < request.getProbationDays();

        // ── S_Performance ────────────────────────────────────────────────────
        double sPerformance = StaffMatchingScoreCalculator.scorePerformance(
                staff.getRevenue(),
                staff.getTotalDeals(),
                request.getPTarget());

        // ── S_Workload ───────────────────────────────────────────────────────
        // currentLoad = số assignmentBuildings đang active của staff
        int currentLoad = staff.getAssignmentBuildings() != null
                ? staff.getAssignmentBuildings().size()
                : 0;

        double sWorkload = StaffMatchingScoreCalculator.scoreWorkload(
                currentLoad,
                request.getLMax());

        // ── Newbie Bonus ─────────────────────────────────────────────────────
        double bonus = isNewbie
                ? StaffMatchingScoreCalculator.newbieBonus(daysWorked, request.getProbationDays())
                : 0.0;

        // ── Score_CS tổng hợp ────────────────────────────────────────────────
        double totalCS = StaffMatchingScoreCalculator.totalScoreCS(
                request.getScoreCustomer(),
                sPerformance,
                sWorkload,
                bonus);

        // ── Đóng gói kết quả ─────────────────────────────────────────────────
        StaffMatchingResult result = new StaffMatchingResult();
        result.setStaffId(staff.getId());
        result.setStaffName(staff.getFullName());
        result.setEmail(staff.getEmail());
        result.setPhone(staff.getPhone());
        result.setWorkingArea(staff.getWorkingArea());
        result.setScoreCustomer(StaffMatchingScoreCalculator.round(request.getScoreCustomer()));
        result.setScorePerformance(StaffMatchingScoreCalculator.round(sPerformance));
        result.setScoreWorkload(StaffMatchingScoreCalculator.round(sWorkload));
        result.setNewbieBonus(StaffMatchingScoreCalculator.round(bonus));
        result.setTotalScoreCS(StaffMatchingScoreCalculator.round(totalCS));
        result.setCurrentLoad(currentLoad);
        result.setNewbie(isNewbie);
        result.setDaysWorked(daysWorked);
        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Tính số ngày đã đi làm (t).
     * Dùng createdDate từ BaseEntity làm ngày onboard.
     * Nếu không có → coi là nhân viên cũ (daysWorked = Integer.MAX_VALUE).
     */
    private int calcDaysWorked(UserEntity staff) {
        Date onboardDate = staff.getCreatedDate(); // từ BaseEntity
        if (onboardDate == null) return Integer.MAX_VALUE;

        long diffMs = new Date().getTime() - onboardDate.getTime();
        return (int) TimeUnit.MILLISECONDS.toDays(diffMs);
    }
}