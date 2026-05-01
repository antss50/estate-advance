package com.javaweb.api;

import com.javaweb.model.response.StaffMatchScore;
import com.javaweb.service.StaffCustomerMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-customer-matching")
@CrossOrigin(origins = "*")
public class StaffCustomerMatchingAPI {

    @Autowired
    private StaffCustomerMatchingService matchingService;

    @GetMapping
    public ResponseEntity<List<StaffMatchScore>> findBestStaffForCustomer(
            @RequestParam String ward,
            @RequestParam(defaultValue = "5") int limit) {

        List<StaffMatchScore> result = matchingService.findBestStaffForCustomer(ward, limit);
        return ResponseEntity.ok(result);
    }
}