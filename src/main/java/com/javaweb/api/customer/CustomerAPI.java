package com.javaweb.api.customer;

import com.javaweb.entity.CustomerEntity;
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

import java.util.List;

@RestController(value = "buildingAPIOfCustomer")
@RequestMapping("/api/customer")
public class CustomerAPI {

    @Autowired
    private CustomerRequestService customerRequestService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private AssignmentCustomerService assignmentCustomerService;



    @PostMapping("/customer-request")
    public ResponseEntity<?> createRequest(@RequestBody CustomerRequestDTO dto) {

        customerRequestService.save(dto);

        return ResponseEntity.ok("Gửi yêu cầu thành công");
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

        List<StaffAssignmentDTO> result =
                assignmentCustomerService.getStaffAssignment(customerId);

        return ResponseEntity.ok(result);
    }

}
