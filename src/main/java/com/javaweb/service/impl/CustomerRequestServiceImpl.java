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

        // Map DemandDTO -> Demand
        DemandEntity demand = new DemandEntity();
        demand.setArea(demandDTO.getArea());
        demand.setPrice(demandDTO.getPrice());
        demand.setWard(demandDTO.getWard());
        demand.setProvince(demandDTO.getProvince());
        // ĐÃ XÓA: demand.setBuildingType(demandDTO.getBuildingType());
        demand.setTransactionType(demandDTO.getTransactionType());  // Giả sử transactionType là String
        // Chuyển đổi propertyType từ String -> Enum
        demand.setPropertyType(PropertyType.valueOf(demandDTO.getPropertyType()));
        demand.setPriorityType(demandDTO.getPriorityType());       // priorityType đã là Enum
        demand.setNumberOfBasement(demandDTO.getNumberOfBasement());
        demand.setDirection(demandDTO.getDirection());             // Giả sử direction là String
        demand.setLegalStatus(demandDTO.getLegalStatus());         // Giả sử legalStatus là String
        demand.setBrokerageFee(demandDTO.getBrokerageFee());
        entity.setDemand(demand);

        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "NEW");

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
                // ĐÃ XÓA: demandDTO.setBuildingType(item.getDemand().getBuildingType());
                demandDTO.setTransactionType(item.getDemand().getTransactionType());  // String
                // Chuyển đổi propertyType từ Enum -> String
                demandDTO.setPropertyType(item.getDemand().getPropertyType().name());
                demandDTO.setPriorityType(item.getDemand().getPriorityType());        // Enum
                demandDTO.setNumberOfBasement(item.getDemand().getNumberOfBasement());
                demandDTO.setDirection(item.getDemand().getDirection());              // String
                demandDTO.setLegalStatus(item.getDemand().getLegalStatus());          // String
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

            // Set thông tin customer
            if (entity.getCustomer() != null) {
                dto.setCustomerId(entity.getCustomer().getId());
                dto.setFullName(entity.getCustomer().getFullName());
                dto.setPhone(entity.getCustomer().getPhone());
                dto.setEmail(entity.getCustomer().getEmail());
            }

            dto.setStatus(entity.getStatus());

            // Set ngày tháng
            if (entity.getCreatedDate() != null) {
                dto.setCreatedDate(entity.getCreatedDate().toString());
            }
            if (entity.getModifiedDate() != null) {
                dto.setModifiedDate(entity.getModifiedDate().toString());
            }

            // Map Demand entity sang DemandDTO
            if (entity.getDemand() != null) {
                DemandDTO demandDTO = new DemandDTO();
                demandDTO.setArea(entity.getDemand().getArea());
                demandDTO.setPrice(entity.getDemand().getPrice());
                demandDTO.setWard(entity.getDemand().getWard());
                demandDTO.setProvince(entity.getDemand().getProvince());
                demandDTO.setTransactionType(entity.getDemand().getTransactionType());     // String
                // Chuyển đổi propertyType từ Enum -> String
                demandDTO.setPropertyType(entity.getDemand().getPropertyType().name());
                demandDTO.setPriorityType(entity.getDemand().getPriorityType());           // Enum
                demandDTO.setNumberOfBasement(entity.getDemand().getNumberOfBasement());
                demandDTO.setDirection(entity.getDemand().getDirection());                 // String
                demandDTO.setLegalStatus(entity.getDemand().getLegalStatus());             // String
                demandDTO.setBrokerageFee(entity.getDemand().getBrokerageFee());
                dto.setDemand(demandDTO);
            }

            result.add(dto);
        }

        return result;
    }
}