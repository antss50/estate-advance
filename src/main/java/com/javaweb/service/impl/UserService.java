package com.javaweb.service.impl;

import com.javaweb.constant.SystemConstant;
import com.javaweb.converter.UserConverter;
import com.javaweb.model.dto.PasswordDTO;
import com.javaweb.model.dto.StaffDTO;
import com.javaweb.model.dto.UserDTO;
import com.javaweb.entity.RoleEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.exception.MyException;
import com.javaweb.repository.RoleRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.IUserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserService implements IUserService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserConverter userConverter;




    @Override
    public UserDTO findOneByUserNameAndStatus(String name, int status) {
        return userConverter.convertToDto(userRepository.findOneByUserNameAndStatus(name, status));
    }

    @Override
    public List<UserDTO> getUsers(String searchValue, Pageable pageable) {
        Page<UserEntity> users = null;
        if (StringUtils.isNotBlank(searchValue)) {
            users = userRepository.findByUserNameContainingIgnoreCaseOrFullNameContainingIgnoreCaseAndStatusNot(searchValue, searchValue, 0, pageable);
        } else {
            users = userRepository.findByStatusNot(0, pageable);
        }
        List<UserEntity> newsEntities = users.getContent();
        List<UserDTO> result = new ArrayList<>();
        for (UserEntity userEntity : newsEntities) {
            UserDTO userDTO = userConverter.convertToDto(userEntity);
            userDTO.setRoleCode(userEntity.getRoles().get(0).getCode());
            result.add(userDTO);
        }
        return result;
    }



    @Override
    public List<UserDTO> getAllUsers(Pageable pageable) {
        List<UserEntity> userEntities = userRepository.getAllUsers(pageable);
        List<UserDTO> results = new ArrayList<>();
        for (UserEntity userEntity : userEntities) {
            UserDTO userDTO = userConverter.convertToDto(userEntity);
            userDTO.setRoleCode(userEntity.getRoles().get(0).getCode());
            results.add(userDTO);
        }
        return results;
    }

    @Override
    public List<StaffDTO> getStaff() {
        List<UserEntity> users = userRepository.findByStatusAndRoles_Code(1, "STAFF");

        return users.stream()
                .map(this::convertToStaffDTO)
                .collect(Collectors.toList());
    }

    private StaffDTO convertToStaffDTO(UserEntity user) {
        StaffDTO dto = new StaffDTO();


        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());


        dto.setPhone(user.getPhone());

        dto.setWorkingArea(user.getWorkingArea());

        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            dto.setRole(user.getRoles().get(0).getCode());
        } else {
            dto.setRole("STAFF");
        }

        if (user.getRevenue() != null) {
            dto.setRevenue(user.getRevenue());
        } else {
            dto.setRevenue(BigDecimal.ZERO);
        }

        if (user.getTotalDeals() != null) {
            dto.setTotalDeals(user.getTotalDeals());
        } else {
            dto.setTotalDeals(0);
        }

        if (user.getPerformance() != null) {
            dto.setPerformance(user.getPerformance());
        } else {
            dto.setPerformance(0.0);
        }

        return dto;
    }

    @Override
    public int countTotalItems() {
        return userRepository.countTotalItem();
    }



    @Override
    public int getTotalItems(String searchValue) {
        int totalItem = 0;
        if (StringUtils.isNotBlank(searchValue)) {
            totalItem = (int) userRepository.countByUserNameContainingIgnoreCaseOrFullNameContainingIgnoreCaseAndStatusNot(searchValue, searchValue, 0);
        } else {
            totalItem = (int) userRepository.countByStatusNot(0);
        }
        return totalItem;
    }


    @Override
    public UserDTO findOneByUserName(String userName) {
        UserEntity userEntity = userRepository.findOneByUserName(userName);
        UserDTO userDTO = userConverter.convertToDto(userEntity);
        return userDTO;
    }

    @Override
    public UserDTO findUserById(long id) {
        UserEntity entity = userRepository.findById(id).get();
        List<RoleEntity> roles = entity.getRoles();
        UserDTO dto = userConverter.convertToDto(entity);
        roles.forEach(item -> {
            dto.setRoleCode(item.getCode());
        });
        return dto;
    }

    @Override
    @Transactional
    public UserDTO insert(UserDTO newUser) {
        RoleEntity role = roleRepository.findOneByCode(newUser.getRoleCode());
        UserEntity userEntity = userConverter.convertToEntity(newUser);
        userEntity.setRoles(Stream.of(role).collect(Collectors.toList()));
        userEntity.setStatus(1);
        userEntity.setPassword(passwordEncoder.encode(SystemConstant.PASSWORD_DEFAULT));
        return userConverter.convertToDto(userRepository.save(userEntity));
    }

    @Override
    @Transactional
    public UserDTO update(Long id, UserDTO updateUser) {
        UserEntity oldUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (updateUser.getUserName() != null && !updateUser.getUserName().equals(oldUser.getUserName())) {
            // Kiểm tra username mới đã tồn tại chưa
            boolean exists = userRepository.existsByUserName(updateUser.getUserName());
            if (exists) {
                throw new RuntimeException("Username already exists: " + updateUser.getUserName());
            }
            oldUser.setUserName(updateUser.getUserName());
        }

        if (updateUser.getFullName() != null) {
            oldUser.setFullName(updateUser.getFullName());
        }

        if (updateUser.getEmail() != null && !updateUser.getEmail().equals(oldUser.getEmail())) {
            Optional<UserEntity> existingUser = userRepository.findByEmail(updateUser.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Email already exists: " + updateUser.getEmail());
            }
            oldUser.setEmail(updateUser.getEmail());
        }

        if (updateUser.getStatus() != null) {
            oldUser.setStatus(updateUser.getStatus());
        }

        if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
            oldUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
        }

        if (updateUser.getRoleCode() != null && !updateUser.getRoleCode().isEmpty()) {
            RoleEntity role = roleRepository.findOneByCode(updateUser.getRoleCode());
            if (role != null) {
                List<RoleEntity> roles = new ArrayList<>();
                roles.add(role);
                oldUser.setRoles(roles);
            }
        }

        UserEntity updatedUser = userRepository.save(oldUser);
        return userConverter.convertToDto(updatedUser);
    }
    @Override
    @Transactional
    public void updatePassword(long id, PasswordDTO passwordDTO) throws MyException {
        UserEntity user = userRepository.findById(id).get();
        if (passwordEncoder.matches(passwordDTO.getOldPassword(), user.getPassword())
                && passwordDTO.getNewPassword().equals(passwordDTO.getConfirmPassword())) {
            user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
            userRepository.save(user);
        } else {
            throw new MyException(SystemConstant.CHANGE_PASSWORD_FAIL);
        }
    }

    @Override
    @Transactional
    public UserDTO resetPassword(long id) {
        UserEntity userEntity = userRepository.findById(id).get();
        userEntity.setPassword(passwordEncoder.encode(SystemConstant.PASSWORD_DEFAULT));
        return userConverter.convertToDto(userRepository.save(userEntity));
    }

    @Override
    @Transactional
    public UserDTO updateProfileOfUser(String username, UserDTO updateUser) {
        UserEntity oldUser = userRepository.findOneByUserName(username);
        oldUser.setFullName(updateUser.getFullName());
        return userConverter.convertToDto(userRepository.save(oldUser));
    }

    @Override
    @Transactional
    public void delete(long[] ids) {
        for (Long item : ids) {
            UserEntity userEntity = userRepository.findById(item).get();
            userEntity.setStatus(0);
            userRepository.save(userEntity);
        }
    }
}
