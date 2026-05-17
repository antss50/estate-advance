package com.javaweb.api.customer;

import com.javaweb.model.dto.AssignmentCustomerDTO;
import com.javaweb.model.dto.CustomerDTO;
import com.javaweb.model.dto.StaffAssignmentDTO;
import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.service.AssignmentCustomerService;
import com.javaweb.service.CustomerRequestService;
import com.javaweb.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerAPI {

    @Autowired
    private CustomerRequestService customerRequestService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AssignmentCustomerService assignmentCustomerService;

    /**
     * Tạo yêu cầu mới (Dùng header customerId)
     */
    @PostMapping("/customer-request")
    public ResponseEntity<?> createRequest(@RequestBody CustomerRequestDTO dto,
                                           @RequestHeader(value = "customerId", required = false) Long customerId) {

        // Kiểm tra customerId từ header
        if (customerId == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Vui lòng đăng nhập lại");
            return ResponseEntity.status(401).body(error);
        }

        Long resultCustomerId = customerRequestService.save(dto, customerId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Gửi yêu cầu thành công");
        response.put("customerId", resultCustomerId);

        return ResponseEntity.ok(response);
    }

    @GetMapping()
    public List<CustomerDTO> getAllCustomers() {
        return customerService.findAll();
    }

    @GetMapping("staff/{staffId}")
    public List<CustomerDTO> getCustomersByStaff(@PathVariable Long staffId) {
        return customerService.findByStaffId(staffId);
    }

    @PostMapping("/assignment")
    public ResponseEntity<?> assignCustomer(@RequestBody AssignmentCustomerDTO dto) {
        assignmentCustomerService.assignCustomer(dto);
        return ResponseEntity.ok("Assign customer to staff successfully");
    }

    @GetMapping("/{customerId}/assignment")
    public ResponseEntity<List<StaffAssignmentDTO>> getAssignment(@PathVariable Long customerId) {
        List<StaffAssignmentDTO> result = assignmentCustomerService.getStaffAssignment(customerId);
        return ResponseEntity.ok(result);
    }
}