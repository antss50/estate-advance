package com.javaweb.service;

import com.javaweb.model.request.CustomerRequestDTO;
import java.util.List;

public interface CustomerRequestService {
    Long save(CustomerRequestDTO dto, Long customerId);
    List<CustomerRequestDTO> getAll();
}