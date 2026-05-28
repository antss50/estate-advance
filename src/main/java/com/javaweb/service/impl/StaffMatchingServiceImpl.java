package com.javaweb.service.impl;

import com.javaweb.entity.UserEntity;
import com.javaweb.model.request.StaffMatchingRequest;
import com.javaweb.model.response.StaffMatchingResponse;
import com.javaweb.model.response.StaffMatchingResult;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.StaffMatchingService;
import com.javaweb.service.WardLocationScorer;
import com.javaweb.utils.StaffMatchingScoreCalculator;
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

    @Autowired
    private WardLocationScorer wardLocationScorer;

    @Override
    public StaffMatchingResponse findMatchingStaff(StaffMatchingRequest request) {
        List<UserEntity> activeStaffs = userRepository.findByStatus(1);

        List<StaffMatchingResult> results = activeStaffs.stream()
                .map(staff -> calculateResult(staff, request))
                .sorted(Comparator.comparingDouble(StaffMatchingResult::getTotalScoreCS).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        StaffMatchingResponse response = new StaffMatchingResponse();
        response.setCustomerId(request.getCustomerId());
        response.setTotalFound(results.size());
        response.setResults(results);
        return response;
    }

    private StaffMatchingResult calculateResult(UserEntity staff, StaffMatchingRequest request) {
        int daysWorked = calcDaysWorked(staff);
        boolean isNewbie = daysWorked < request.getProbationDays();

        double sArea = scoreBestWorkingArea(staff.getWorkingArea(), request.getDemandWardCode());

        double sPerformance = StaffMatchingScoreCalculator.scorePerformance(
                staff.getRevenue(),
                staff.getTotalDeals(),
                request.getPTarget());

        int currentLoad = (staff.getAssignmentBuildings() != null) ? staff.getAssignmentBuildings().size() : 0;
        double sWorkload = StaffMatchingScoreCalculator.scoreWorkload(currentLoad, request.getLMax());

        double bonus = isNewbie
                ? StaffMatchingScoreCalculator.newbieBonus(daysWorked, request.getProbationDays())
                : 0.0;

        // Đúng công thức: Score_CS = (sArea × 0.35) + (sPerf × 0.4) + (sWork × 0.25) + bonus
        double totalCS = StaffMatchingScoreCalculator.totalScoreCS(sArea, sPerformance, sWorkload, bonus);

        StaffMatchingResult result = new StaffMatchingResult();
        result.setStaffId(staff.getId());
        result.setStaffName(staff.getFullName());
        result.setEmail(staff.getEmail());
        result.setPhone(staff.getPhone());
        result.setWorkingArea(staff.getWorkingArea());
        result.setScoreArea(StaffMatchingScoreCalculator.round(sArea));
        result.setScorePerformance(StaffMatchingScoreCalculator.round(sPerformance));
        result.setScoreWorkload(StaffMatchingScoreCalculator.round(sWorkload));
        result.setNewbieBonus(StaffMatchingScoreCalculator.round(bonus));
        result.setTotalScoreCS(StaffMatchingScoreCalculator.round(totalCS));
        result.setCurrentLoad(currentLoad);
        result.setNewbie(isNewbie);
        result.setDaysWorked(daysWorked);
        return result;
    }

    /**
     * workingArea có thể là nhiều wardCode cách nhau dấu phẩy: "001,002,003"
     * Lấy score cao nhất trong tất cả ward của staff so với ward khách.
     */
    private double scoreBestWorkingArea(String workingArea, String demandWardCode) {
        if (workingArea == null || workingArea.trim().isEmpty()) return 0.2;
        if (demandWardCode == null || demandWardCode.trim().isEmpty()) return 1.0;

        double best = 0.2;
        for (String staffWard : workingArea.split(",")) {
            double score = wardLocationScorer.score(staffWard.trim(), demandWardCode);
            if (score > best) best = score;
            if (best == 1.0) break;
        }
        return best;
    }

    private int calcDaysWorked(UserEntity staff) {
        Date onboardDate = staff.getCreatedDate();
        if (onboardDate == null) return Integer.MAX_VALUE;
        long diffMs = new Date().getTime() - onboardDate.getTime();
        return (int) TimeUnit.MILLISECONDS.toDays(diffMs);
    }
}