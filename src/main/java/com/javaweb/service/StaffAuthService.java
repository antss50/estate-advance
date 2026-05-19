package com.javaweb.service;

import com.javaweb.model.request.StaffLoginRequest;
import com.javaweb.model.request.StaffRegisterRequest;
import com.javaweb.model.response.StaffLoginResponse;
import com.javaweb.model.response.StaffRegisterResponse;

public interface StaffAuthService {

    StaffRegisterResponse register(StaffRegisterRequest request);

    StaffLoginResponse login(StaffLoginRequest request);
}