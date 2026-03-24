package com.javaweb.api.customer;

import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.service.CustomerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController(value = "buildingAPIOfCustomer")
@RequestMapping("/api")
public class CustomerAPI {

    @Autowired
    private CustomerRequestService customerRequestService;

    @PostMapping("/customer-request")
    public ResponseEntity<?> createRequest(@RequestBody CustomerRequestDTO dto) {

        customerRequestService.save(dto);

        return ResponseEntity.ok("Gửi yêu cầu thành công");
    }
}
