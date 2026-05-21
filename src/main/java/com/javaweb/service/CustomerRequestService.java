package com.javaweb.service;

import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.model.response.CustomerRequestResponseDTO;

import java.util.List;

public interface CustomerRequestService {
    Long save(CustomerRequestDTO dto, Long customerId);
    List<CustomerRequestDTO> getAll();
    // Lấy danh sách customer request theo staffId
    List<CustomerRequestResponseDTO> getCustomerRequestsByStaffId(Long staffId);
}