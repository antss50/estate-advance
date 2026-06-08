package com.javaweb.api;

import com.javaweb.model.request.CustomerMatchingRequest;
import com.javaweb.model.response.CustomerMatchingResponse;
import com.javaweb.service.CustomerBuildingMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-matching")
// @CrossOrigin(origins = "*")
public class CustomerMatchingAPI {

    @Autowired
    private CustomerBuildingMatchingService matchingService;

    @PostMapping("/find-buildings")
    public ResponseEntity<CustomerMatchingResponse> findMatchingBuildings(@RequestBody CustomerMatchingRequest request) {
            CustomerMatchingResponse response = matchingService.findMatchingBuildings(request);
        return ResponseEntity.ok(response);
    }
}