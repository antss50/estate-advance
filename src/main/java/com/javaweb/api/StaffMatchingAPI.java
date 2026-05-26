package com.javaweb.api;

import com.javaweb.model.request.StaffMatchingRequest;
import com.javaweb.model.response.StaffMatchingResponse;
import com.javaweb.service.StaffMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff-matching")
public class StaffMatchingAPI {

    @Autowired
    private StaffMatchingService staffMatchingService;

    /**
     * Tìm staff phù hợp nhất cho một khách hàng.
     *
     * Ví dụ request:
     * POST /api/staff-matching/find-staff
     * {
     *   "customerId": 42,
     *   "scoreCustomer": 0.82,   ← lấy từ kết quả CustomerMatchingAPI
     *   "topN": 3
     * }
     */
    @PostMapping("/find-staff")
    public ResponseEntity<StaffMatchingResponse> findMatchingStaff(
            @RequestBody StaffMatchingRequest request) {

        StaffMatchingResponse response = staffMatchingService.findMatchingStaff(request);
        return ResponseEntity.ok(response);
    }
}