package com.javaweb.api;


import com.javaweb.model.request.CustomerStatusUpdateRequest;
import com.javaweb.model.response.CustomerStatusUpdateResponse;
import com.javaweb.service.impl.CustomerStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer-status")
public class CustomerStatusAPI {

    @Autowired
    private CustomerStatusService customerStatusService;

    /**
     * Cập nhật trạng thái khách hàng.
     *
     * Ví dụ — Chuyển ASSIGNED → CONSULTING:
     * PUT /api/customer-status/update
     * { "customerId": 42, "newStatus": "CONSULTING" }
     *
     * Ví dụ — Chuyển SIGNED → PAID (BÁN):
     * {
     *   "customerId": 42,
     *   "newStatus": "PAID",
     *   "staffId": 7,
     *   "transactionType": "SALE",
     *   "contractValue": 3500000000
     * }
     *
     * Ví dụ — Chuyển SIGNED → PAID (THUÊ):
     * {
     *   "customerId": 42,
     *   "newStatus": "PAID",
     *   "staffId": 7,
     *   "transactionType": "RENT",
     *   "monthlyRent": 15000000,
     *   "contractMonths": 24
     * }
     */
    @PutMapping("/update")
    public ResponseEntity<CustomerStatusUpdateResponse> updateStatus(
            @RequestBody CustomerStatusUpdateRequest request) {

        CustomerStatusUpdateResponse response = customerStatusService.updateStatus(request);
        return ResponseEntity.ok(response);
    }
}