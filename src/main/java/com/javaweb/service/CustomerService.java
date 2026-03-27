package com.javaweb.service;

import com.javaweb.entity.CustomerEntity;
import com.javaweb.model.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    List<CustomerDTO> findAll();
    List<CustomerDTO> findByStaffId(Long staffId);
}
