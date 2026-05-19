package com.javaweb.service.impl;

import com.javaweb.entity.RoleEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.request.StaffLoginRequest;
import com.javaweb.model.request.StaffRegisterRequest;
import com.javaweb.model.response.StaffLoginResponse;
import com.javaweb.model.response.StaffRegisterResponse;
import com.javaweb.repository.RoleRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.StaffAuthService;
import com.javaweb.utils.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@Service
public class StaffAuthServiceImpl implements StaffAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoderUtil passwordEncoderUtil;

    @Override
    @Transactional
    public StaffRegisterResponse register(StaffRegisterRequest request) {
        // Kiểm tra username đã tồn tại
        if (userRepository.existsByUserName(request.getUserName())) {
            return new StaffRegisterResponse(null, null, null, null, null,
                    "Tên đăng nhập đã tồn tại", false);
        }

        // Tìm role STAFF
        RoleEntity staffRole = roleRepository.findOneByCode("STAFF");

        if (staffRole == null) {
            return new StaffRegisterResponse(null, null, null, null, null,
                    "Role STAFF chưa được cấu hình trong hệ thống", false);
        }

        // Tạo user mới
        UserEntity user = new UserEntity();
        user.setUserName(request.getUserName());
        user.setPassword(passwordEncoderUtil.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setWorkingArea(request.getWorkingArea());
        user.setStatus(1);
        user.setCreatedDate(new Date());
        user.setRoles(Arrays.asList(staffRole));

        UserEntity saved = userRepository.save(user);

        return new StaffRegisterResponse(
                saved.getId(),
                saved.getUserName(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getPhone(),
                "Đăng ký nhân viên thành công",
                true
        );
    }

    @Override
    public StaffLoginResponse login(StaffLoginRequest request) {
        // Tìm user theo username (dùng Optional)
        Optional<UserEntity> userOpt = userRepository.findByUserName(request.getUserName());

        if (!userOpt.isPresent()) {
            return new StaffLoginResponse(null, null, null, null, null, null, null,
                    "Tên đăng nhập không tồn tại", false);
        }

        UserEntity user = userOpt.get();

        // Kiểm tra tài khoản có bị khóa không
        if (user.getStatus() == null || user.getStatus() != 1) {
            return new StaffLoginResponse(null, null, null, null, null, null, null,
                    "Tài khoản đã bị khóa", false);
        }

        // Kiểm tra role có phải STAFF không
        boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getCode()));

        if (!isStaff) {
            return new StaffLoginResponse(null, null, null, null, null, null, null,
                    "Tài khoản không có quyền nhân viên", false);
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoderUtil.matches(request.getPassword(), user.getPassword())) {
            return new StaffLoginResponse(null, null, null, null, null, null, null,
                    "Mật khẩu không chính xác", false);
        }

        // Cập nhật thời gian đăng nhập cuối
        user.setLastLogin(new Date());
        userRepository.save(user);

        // Tạo token
        String token = generateToken(user);

        return new StaffLoginResponse(
                user.getId(),
                user.getUserName(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getWorkingArea(),
                token,
                "Đăng nhập thành công",
                true
        );
    }

    private String generateToken(UserEntity user) {
        String rawToken = user.getUserName() + ":" + System.currentTimeMillis();
        return java.util.Base64.getEncoder().encodeToString(rawToken.getBytes());
    }
}