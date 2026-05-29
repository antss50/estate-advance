package com.javaweb.api;

import com.javaweb.model.request.BuildingStaffMatchingRequest;
import com.javaweb.model.response.BuildingStaffMatchingResponse;
import com.javaweb.service.BuildingStaffMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/building-staff-matching")
public class BuildingStaffMatchingAPI {

    @Autowired
    private BuildingStaffMatchingService matchingService;

    /**
     * Tìm staff phù hợp nhất để phụ trách một building.
     *
     * Ví dụ request — building tồn kho 8 tháng:
     * POST /api/building-staff-matching/find-staff
     * {
     *   "buildingId": 5,
     *   "monthsInInventory": 8,
     *   "topN": 3
     * }
     *
     * Response trả về:
     * {
     *   "buildingId": 5,
     *   "buildingName": "Tòa nhà ABC",
     *   "scoreBuilding": 0.72,        ← độ khó của building
     *   "results": [
     *     {
     *       "staffName": "Nguyễn Văn A",
     *       "scoreArea": 1.0,          ← cùng huyện/phường với building
     *       "scorePerformance": 0.85,
     *       "scoreWorkload": 0.6,
     *       "totalScoreBS": 0.834
     *     }
     *   ]
     * }
     */
    @PostMapping("/find-staff")
    public ResponseEntity<BuildingStaffMatchingResponse> findMatchingStaff(
            @RequestBody BuildingStaffMatchingRequest request) {

        BuildingStaffMatchingResponse response = matchingService.findMatchingStaff(request);
        return ResponseEntity.ok(response);
    }
}