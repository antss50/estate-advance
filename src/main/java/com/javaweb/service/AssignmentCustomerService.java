package com.javaweb.service;

import com.javaweb.model.dto.AssignmentCustomerDTO;
import com.javaweb.model.dto.StaffAssignmentDTO;

import java.util.List;

public interface AssignmentCustomerService {
    void assignCustomer(AssignmentCustomerDTO dto);
    List<StaffAssignmentDTO> getStaffAssignment(Long customerId);
}
