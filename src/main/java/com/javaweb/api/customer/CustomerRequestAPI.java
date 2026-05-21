package com.javaweb.api.customer;

import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.model.response.CustomerRequestResponseDTO;
import com.javaweb.service.CustomerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-request")
//@CrossOrigin(origins = "*")
public class CustomerRequestAPI {

    @Autowired
    private CustomerRequestService customerRequestService;

    @GetMapping
    public ResponseEntity<List<CustomerRequestDTO>> getAllCustomerRequest() {
        return ResponseEntity.ok(customerRequestService.getAll());
    }

    /**
     * API lấy danh sách customer request theo staffId
     * GET /api/customer-request/staff/{staffId}
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<CustomerRequestResponseDTO>> getCustomerRequestsByStaffId(
            @PathVariable Long staffId) {
        List<CustomerRequestResponseDTO> result = customerRequestService.getCustomerRequestsByStaffId(staffId);
        return ResponseEntity.ok(result);
    }
    /**
     -- Tạo customer request mẫu
     INSERT INTO customer_request (customer_id, status, createddate)
     VALUES
     (1, 'NEW', NOW()),
     (2, 'CONSULTING', NOW()),
     (3, 'SIGNED', NOW());

     -- Gán customer cho staff (bảng assignment_customer)
     INSERT INTO assignment_customer (customerid, staffid, createddate) VALUES
     (1, 54, NOW()),  -- Customer 1 gán cho staff 54
     (2, 54, NOW()),  -- Customer 2 gán cho staff 54
     (3, 55, NOW());  -- Customer 3 gán cho staff 55

     # Lấy customer request của staff có id = 54
     GET http://localhost:8080/api/customer-request/staff/54

     # Response mẫu
     [
     {
     "id": 1,
     "customerId": 1,
     "fullName": "Nguyễn Văn A",
     "phone": "0901111111",
     "email": "customer1@example.com",
     "demand": null,
     "status": "NEW",
     "createdDate": "2026-05-21 10:00:00",
     "modifiedDate": null
     },
     {
     "id": 2,
     "customerId": 2,
     "fullName": "Trần Thị B",
     "phone": "0902222222",
     "email": "customer2@example.com",
     "demand": null,
     "status": "CONSULTING",
     "createdDate": "2026-05-21 10:00:00",
     "modifiedDate": null
     }
     ]
     */

}