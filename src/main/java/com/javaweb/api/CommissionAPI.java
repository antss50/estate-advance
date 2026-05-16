package com.javaweb.api;

import com.javaweb.model.dto.CommissionDTO;
import com.javaweb.service.CommissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/commission")
// @CrossOrigin(origins = "*")
public class CommissionAPI {

    @Autowired
    private CommissionService commissionService;

    @PostMapping("/calculate")
    public ResponseEntity<CommissionDTO> calculateCommission(
            @RequestParam Long customerId,
            @RequestParam Long staffId,
            @RequestParam Long buildingId,
            @RequestParam String transactionType,
            @RequestParam BigDecimal contractValue,
            @RequestParam(required = false) Integer rentMonths,
            @RequestParam String currentStatus) {

        CommissionDTO result = commissionService.calculateCommission(
                customerId, staffId, buildingId, transactionType,
                contractValue, rentMonths, currentStatus
        );

        return ResponseEntity.ok(result);
    }
}