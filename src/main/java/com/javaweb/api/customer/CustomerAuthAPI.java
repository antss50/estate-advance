package com.javaweb.api.customer;

import com.javaweb.model.request.CustomerLoginRequest;
import com.javaweb.model.request.CustomerRegisterRequest;
import com.javaweb.model.response.CustomerLoginResponse;
import com.javaweb.model.response.CustomerRegisterResponse;
import com.javaweb.service.CustomerAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/customer/auth")
@CrossOrigin(origins = "*")
public class CustomerAuthAPI {

    @Autowired
    private CustomerAuthService customerAuthService;

    @PostMapping("/register")
    public ResponseEntity<CustomerRegisterResponse> register(@Valid @RequestBody CustomerRegisterRequest request) {
        CustomerRegisterResponse response = customerAuthService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<CustomerLoginResponse> login(@Valid @RequestBody CustomerLoginRequest request) {
        CustomerLoginResponse response = customerAuthService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}