package com.javaweb.service;

import com.javaweb.model.request.CustomerLoginRequest;
import com.javaweb.model.request.CustomerRegisterRequest;
import com.javaweb.model.response.CustomerLoginResponse;
import com.javaweb.model.response.CustomerRegisterResponse;

public interface CustomerAuthService {

    CustomerRegisterResponse register(CustomerRegisterRequest request);

    CustomerLoginResponse login(CustomerLoginRequest request);
}