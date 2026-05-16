package com.javaweb.service.impl;

import com.javaweb.entity.CustomerEntity;
import com.javaweb.model.request.CustomerLoginRequest;
import com.javaweb.model.request.CustomerRegisterRequest;
import com.javaweb.model.response.CustomerLoginResponse;
import com.javaweb.model.response.CustomerRegisterResponse;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.service.CustomerAuthService;
import com.javaweb.utils.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class CustomerAuthServiceImpl implements CustomerAuthService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoderUtil passwordEncoderUtil;

    @Override
    public CustomerRegisterResponse register(CustomerRegisterRequest request) {
        // Kiểm tra username đã tồn tại
        if (customerRepository.existsByUsername(request.getUsername())) {
            return new CustomerRegisterResponse(null, null, null, null, null, "Tên đăng nhập đã tồn tại", false);
        }

        // Kiểm tra email đã tồn tại (nếu có email)
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (customerRepository.existsByEmail(request.getEmail())) {
                return new CustomerRegisterResponse(null, null, null, null, null, "Email đã được sử dụng", false);
            }
        }

        // Tạo customer mới
        CustomerEntity customer = new CustomerEntity();
        customer.setUsername(request.getUsername());
        customer.setPassword(passwordEncoderUtil.encode(request.getPassword()));
        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setCompanyName(request.getCompanyName());
        customer.setDemand(request.getDemand());
        customer.setIsActive(1);
        customer.setCreatedDate(new Date());

        CustomerEntity saved = customerRepository.save(customer);

        return new CustomerRegisterResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getFullName(),
                saved.getPhone(),
                saved.getEmail(),
                "Đăng ký thành công",
                true
        );
    }

    @Override
    public CustomerLoginResponse login(CustomerLoginRequest request) {
        // Tìm customer theo username
        Optional<CustomerEntity> customerOpt = customerRepository.findByUsername(request.getUsername());

        // SỬA: dùng !customerOpt.isPresent() thay vì customerOpt.isEmpty()
        if (!customerOpt.isPresent()) {
            return new CustomerLoginResponse(null, null, null, null, null, null, "Tên đăng nhập không tồn tại", false);
        }

        CustomerEntity customer = customerOpt.get();

        // Kiểm tra tài khoản có bị khóa không
        if (customer.getIsActive() == null || customer.getIsActive() != 1) {
            return new CustomerLoginResponse(null, null, null, null, null, null, "Tài khoản đã bị khóa", false);
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoderUtil.matches(request.getPassword(), customer.getPassword())) {
            return new CustomerLoginResponse(null, null, null, null, null, null, "Mật khẩu không chính xác", false);
        }

        // Cập nhật thời gian đăng nhập cuối
        customer.setLastLogin(new Date());
        customerRepository.save(customer);

        // Tạo token (tạm thời dùng Base64, có thể thay bằng JWT sau)
        String token = generateToken(customer);

        return new CustomerLoginResponse(
                customer.getId(),
                customer.getUsername(),
                customer.getFullName(),
                customer.getPhone(),
                customer.getEmail(),
                token,
                "Đăng nhập thành công",
                true
        );
    }

    private String generateToken(CustomerEntity customer) {
        // Tạo token đơn giản (username + timestamp) base64
        String rawToken = customer.getUsername() + ":" + System.currentTimeMillis();
        return java.util.Base64.getEncoder().encodeToString(rawToken.getBytes());
    }
}