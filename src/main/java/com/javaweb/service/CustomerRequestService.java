package com.javaweb.service;

import com.javaweb.model.request.CustomerRequestDTO;

import java.util.List;

public interface CustomerRequestService {
    void save(CustomerRequestDTO dto);
    List<CustomerRequestDTO> getAll();
}
