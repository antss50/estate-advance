package com.javaweb.service.impl;

import com.javaweb.entity.AssignmentCustomerEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.DemandEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.model.dto.AssignmentCustomerDTO;
import com.javaweb.model.dto.StaffAssignmentDTO;
import com.javaweb.repository.AssignmentCustomerRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.DemandRepository;
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
public class AssignmentCustomerServiceImpl implements AssignmentCustomerService {

    @Autowired
    private AssignmentCustomerRepository assignmentCustomerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DemandRepository demandRepository;

    @Override
    public void assignCustomer(AssignmentCustomerDTO dto) {

        // 1. Load customer
        CustomerEntity customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy customer id: " + dto.getCustomerId()));

        // 2. Load demand — bắt buộc phải có demandId
        if (dto.getDemandId() == null) {
            throw new IllegalArgumentException("demandId là bắt buộc khi phân công staff");
        }
        DemandEntity demand = demandRepository.findById(dto.getDemandId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy demand id: " + dto.getDemandId()));

        // 3. Validate demand phải thuộc customer này
        if (!demand.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException(
                    "Demand " + dto.getDemandId() + " không thuộc customer " + dto.getCustomerId());
        }

        // 4. Xóa assignment cũ theo demand này (không xóa assignment của demand khác)
        assignmentCustomerRepository.deleteByCustomer_IdAndDemand_Id(
                dto.getCustomerId(), dto.getDemandId());

        // 5. Tạo assignment mới cho từng staff
        for (Long staffId : dto.getStaffIds()) {
            UserEntity staff = userRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy staff id: " + staffId));

            AssignmentCustomerEntity assignment = new AssignmentCustomerEntity();
            assignment.setCustomer(customer);
            assignment.setDemand(demand);   // ← gán demand cụ thể
            assignment.setStaff(staff);

            assignmentCustomerRepository.save(assignment);
        }

        // 6. Cập nhật status customer NEW → ASSIGNED
        if (customer.getStatus() == CustomerStatus.NEW) {
            customer.setStatus(CustomerStatus.ASSIGNED);
            customerRepository.save(customer);
        }
    }

    @Override
    public List<StaffAssignmentDTO> getStaffAssignment(Long customerId) {
        // Giữ nguyên: lấy tất cả staff và check đã assign cho customer này chưa
        List<UserEntity> staffs = userRepository.findByStatusAndRoleCode(1, "STAFF");

        List<AssignmentCustomerEntity> assignments =
                assignmentCustomerRepository.findByCustomer_Id(customerId);

        Set<Long> assignedStaffIds = assignments.stream()
                .map(a -> a.getStaff().getId())
                .collect(Collectors.toSet());

        List<StaffAssignmentDTO> result = new ArrayList<>();
        for (UserEntity staff : staffs) {
            StaffAssignmentDTO dto = new StaffAssignmentDTO();
            dto.setStaffId(staff.getId());
            dto.setFullName(staff.getFullName());
            dto.setChecked(assignedStaffIds.contains(staff.getId()));
            result.add(dto);
        }
        return result;
    }

    /**
     * Lấy danh sách staff đã assign cho một demand cụ thể.
     */
    public List<StaffAssignmentDTO> getStaffAssignmentByDemand(Long customerId, Long demandId) {
        List<UserEntity> staffs = userRepository.findByStatusAndRoleCode(1, "STAFF");

        List<AssignmentCustomerEntity> assignments =
                assignmentCustomerRepository.findByCustomer_IdAndDemand_Id(customerId, demandId);

        Set<Long> assignedStaffIds = assignments.stream()
                .map(a -> a.getStaff().getId())
                .collect(Collectors.toSet());

        List<StaffAssignmentDTO> result = new ArrayList<>();
        for (UserEntity staff : staffs) {
            StaffAssignmentDTO dto = new StaffAssignmentDTO();
            dto.setStaffId(staff.getId());
            dto.setFullName(staff.getFullName());
            dto.setChecked(assignedStaffIds.contains(staff.getId()));
            result.add(dto);
        }
        return result;
    }
}