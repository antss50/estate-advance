package com.javaweb.service.impl;

import com.javaweb.entity.AssignmentCustomerEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.dto.AssignmentCustomerDTO;
import com.javaweb.repository.AssignmentCustomerRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.AssignmentCustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AssignmentCustomerServiceImpl  implements AssignmentCustomerService
{
    @Autowired
    private AssignmentCustomerRepository assignmentCustomerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;
    @Override
    public void assignCustomer(AssignmentCustomerDTO dto) {

            // 1. XÓA assignment cũ
            assignmentCustomerRepository.deleteByCustomer_Id(dto.getCustomerId());
            // 2. LẤY customer
            CustomerEntity customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // 3. INSERT lại danh sách staff mới
            for (Long staffId : dto.getStaffIds()) {

                UserEntity staff = userRepository.findById(staffId)
                        .orElseThrow(() -> new RuntimeException("Staff not found"));

                AssignmentCustomerEntity assignment = new AssignmentCustomerEntity();
                assignment.setCustomer(customer);
                assignment.setStaff(staff);

                assignmentCustomerRepository.save(assignment);
            }

    }
}
