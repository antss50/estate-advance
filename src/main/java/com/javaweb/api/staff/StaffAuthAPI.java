package com.javaweb.api.staff;

import com.javaweb.model.request.StaffLoginRequest;
import com.javaweb.model.request.StaffRegisterRequest;
import com.javaweb.model.response.StaffLoginResponse;
import com.javaweb.model.response.StaffRegisterResponse;
import com.javaweb.service.StaffAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/staff/auth")
//@CrossOrigin(origins = "*")
public class StaffAuthAPI {

    @Autowired
    private StaffAuthService staffAuthService;

    /**
     * Đăng ký tài khoản nhân viên (STAFF)
     * POST /api/staff/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<StaffRegisterResponse> register(@Valid @RequestBody StaffRegisterRequest request) {
        StaffRegisterResponse response = staffAuthService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Đăng nhập cho nhân viên (STAFF)
     * POST /api/staff/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<StaffLoginResponse> login(@Valid @RequestBody StaffLoginRequest request) {
        StaffLoginResponse response = staffAuthService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}