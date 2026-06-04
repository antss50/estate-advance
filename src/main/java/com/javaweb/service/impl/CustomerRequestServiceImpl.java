package com.javaweb.service.impl;

import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.DemandEntity;
import com.javaweb.enums.PropertyType;
import com.javaweb.model.dto.DemandDTO;
import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.model.response.CustomerRequestResponseDTO;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.CustomerRequestRepository;
import com.javaweb.service.CustomerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerRequestServiceImpl implements CustomerRequestService {

    @Autowired
    private CustomerRequestRepository customerRequestRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Long save(CustomerRequestDTO dto, Long customerId) {

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + customerId));

        if (dto.getDemand() == null) {
            throw new RuntimeException("Demand không được để trống");
        }

        DemandDTO demandDTO = dto.getDemand();

        // Kiểm tra các trường bắt buộc
        if (demandDTO.getArea() == null || demandDTO.getArea() <= 0) {
            throw new RuntimeException("Diện tích (area) là bắt buộc");
        }
        if (demandDTO.getPrice() == null || demandDTO.getPrice() <= 0) {
            throw new RuntimeException("Giá (price) là bắt buộc");
        }
        if (demandDTO.getWard() == null || demandDTO.getWard().trim().isEmpty()) {
            throw new RuntimeException("Phường/Xã (ward) là bắt buộc");
        }
        if (demandDTO.getProvince() == null || demandDTO.getProvince().trim().isEmpty()) {
            throw new RuntimeException("Tỉnh/Thành phố (province) là bắt buộc");
        }
        if (demandDTO.getTransactionType() == null || demandDTO.getTransactionType().trim().isEmpty()) {
            throw new RuntimeException("Loại giao dịch (transactionType) là bắt buộc");
        }
        if (demandDTO.getPropertyType() == null || demandDTO.getPropertyType().trim().isEmpty()) {
            throw new RuntimeException("Loại bất động sản (propertyType) là bắt buộc");
        }
        if (demandDTO.getPriorityType() == null) {
            throw new RuntimeException("Loại ưu tiên (priorityType) là bắt buộc");
        }

        // Tạo CustomerRequestEntity
        CustomerRequestEntity entity = new CustomerRequestEntity();
        entity.setCustomer(customer);
        entity.setFullName(customer.getFullName());
        entity.setPhone(customer.getPhone());
        entity.setEmail(customer.getEmail());

        // Map DemandDTO -> DemandEntity
        DemandEntity demand = new DemandEntity();
        demand.setArea(demandDTO.getArea());
        demand.setPrice(demandDTO.getPrice());
        demand.setWard(demandDTO.getWard());
        demand.setProvince(demandDTO.getProvince());
        demand.setTransactionType(demandDTO.getTransactionType());
        demand.setPropertyType(PropertyType.valueOf(demandDTO.getPropertyType()));
        demand.setPriorityType(demandDTO.getPriorityType());
        demand.setNumberOfBasement(demandDTO.getNumberOfBasement());
        demand.setDirection(demandDTO.getDirection());
        demand.setLegalStatus(demandDTO.getLegalStatus());
        demand.setBrokerageFee(demandDTO.getBrokerageFee());

        // 🔁 QUAN TRỌNG: set khóa ngoại customer cho demand (vì demand có @ManyToOne bắt buộc)
        demand.setCustomer(customer);

        // Gán demand cho request (cascade sẽ tự lưu demand trước)
        entity.setDemand(demand);
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "NEW");

        // Lưu – Hibernate sẽ tự động lưu demand trước do cascade = CascadeType.PERSIST
        customerRequestRepository.save(entity);

        return customer.getId();
    }

    @Override
    public List<CustomerRequestDTO> getAll() {
        List<CustomerRequestEntity> entities = customerRequestRepository.findAll();
        List<CustomerRequestDTO> result = new ArrayList<>();

        for (CustomerRequestEntity item : entities) {
            CustomerRequestDTO dto = new CustomerRequestDTO();
            dto.setId(item.getId());

            if (item.getCustomer() != null) {
                dto.setCustomerId(item.getCustomer().getId());
                dto.setFullName(item.getCustomer().getFullName());
                dto.setPhone(item.getCustomer().getPhone());
                dto.setEmail(item.getCustomer().getEmail());
            } else {
                dto.setFullName(item.getFullName());
                dto.setPhone(item.getPhone());
                dto.setEmail(item.getEmail());
            }

            dto.setStatus(item.getStatus());

            if (item.getDemand() != null) {
                DemandDTO demandDTO = new DemandDTO();
                demandDTO.setArea(item.getDemand().getArea());
                demandDTO.setPrice(item.getDemand().getPrice());
                demandDTO.setWard(item.getDemand().getWard());
                demandDTO.setProvince(item.getDemand().getProvince());
                demandDTO.setTransactionType(item.getDemand().getTransactionType());
                demandDTO.setPropertyType(item.getDemand().getPropertyType().name());
                demandDTO.setPriorityType(item.getDemand().getPriorityType());
                demandDTO.setNumberOfBasement(item.getDemand().getNumberOfBasement());
                demandDTO.setDirection(item.getDemand().getDirection());
                demandDTO.setLegalStatus(item.getDemand().getLegalStatus());
                demandDTO.setBrokerageFee(item.getDemand().getBrokerageFee());
                dto.setDemand(demandDTO);
            }

            result.add(dto);
        }
        return result;
    }

    @Override
    public List<CustomerRequestResponseDTO> getCustomerRequestsByStaffId(Long staffId) {
        List<CustomerRequestEntity> entities = customerRequestRepository.findByStaffId(staffId);
        List<CustomerRequestResponseDTO> result = new ArrayList<>();

        for (CustomerRequestEntity entity : entities) {
            CustomerRequestResponseDTO dto = new CustomerRequestResponseDTO();
            dto.setId(entity.getId());

            if (entity.getCustomer() != null) {
                dto.setCustomerId(entity.getCustomer().getId());
                dto.setFullName(entity.getCustomer().getFullName());
                dto.setPhone(entity.getCustomer().getPhone());
                dto.setEmail(entity.getCustomer().getEmail());
            }

            dto.setStatus(entity.getStatus());

            if (entity.getCreatedDate() != null) {
                dto.setCreatedDate(entity.getCreatedDate().toString());
            }
            if (entity.getModifiedDate() != null) {
                dto.setModifiedDate(entity.getModifiedDate().toString());
            }

            if (entity.getDemand() != null) {
                DemandDTO demandDTO = new DemandDTO();
                demandDTO.setArea(entity.getDemand().getArea());
                demandDTO.setPrice(entity.getDemand().getPrice());
                demandDTO.setWard(entity.getDemand().getWard());
                demandDTO.setProvince(entity.getDemand().getProvince());
                demandDTO.setTransactionType(entity.getDemand().getTransactionType());
                demandDTO.setPropertyType(entity.getDemand().getPropertyType().name());
                demandDTO.setPriorityType(entity.getDemand().getPriorityType());
                demandDTO.setNumberOfBasement(entity.getDemand().getNumberOfBasement());
                demandDTO.setDirection(entity.getDemand().getDirection());
                demandDTO.setLegalStatus(entity.getDemand().getLegalStatus());
                demandDTO.setBrokerageFee(entity.getDemand().getBrokerageFee());
                dto.setDemand(demandDTO);
            }

            result.add(dto);
        }
        return result;
    }
}