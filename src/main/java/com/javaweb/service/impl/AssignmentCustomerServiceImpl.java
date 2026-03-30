package com.javaweb.service.impl;

import com.javaweb.entity.AssignmentCustomerEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.model.dto.AssignmentCustomerDTO;
import com.javaweb.model.dto.StaffAssignmentDTO;
import com.javaweb.repository.AssignmentCustomerRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.UserRepository;
import com.javaweb.service.AssignmentCustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
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

    @Override
    public List<StaffAssignmentDTO> getStaffAssignment(Long customerId) {

        List<UserEntity> staffs = userRepository.findByStatusAndRoleCode(1, "STAFF");


        List<AssignmentCustomerEntity> assignments =
                assignmentCustomerRepository.findByCustomer_Id(customerId);


        Set<Long> assignedStaffIds = assignments.stream()
                .map(item -> item.getStaff().getId())
                .collect(Collectors.toSet());


        List<StaffAssignmentDTO> result = new ArrayList<>();

        for (UserEntity staff : staffs) {
            StaffAssignmentDTO dto = new StaffAssignmentDTO();

            dto.setStaffId(staff.getId());
            dto.setFullName(staff.getFullName());

            // QUAN TRỌNG: check đã assign chưa
            dto.setChecked(assignedStaffIds.contains(staff.getId()));

            result.add(dto);
        }

        return result;
    }
}
