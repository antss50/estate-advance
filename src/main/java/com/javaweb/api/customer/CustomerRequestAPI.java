package com.javaweb.api.customer;

import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.service.CustomerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customer-request")
public class CustomerRequestAPI {

    @Autowired
    private CustomerRequestService customerRequestService;

    @GetMapping
    public ResponseEntity<List<CustomerRequestDTO>> getAllCustomerRequest() {
        return ResponseEntity.ok(customerRequestService.getAll());
    }
}
