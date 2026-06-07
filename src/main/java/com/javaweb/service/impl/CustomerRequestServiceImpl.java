package com.javaweb.service.impl;

import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.DemandEntity;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.enums.PropertyType;
import com.javaweb.model.dto.DemandDTO;
import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.model.response.CustomerRequestResponseDTO;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.CustomerRequestRepository;
import com.javaweb.repository.DemandRepository;
import com.javaweb.service.CustomerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerRequestServiceImpl implements CustomerRequestService {

    @Autowired
    private CustomerRequestRepository customerRequestRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DemandRepository demandRepository; // FIX: lưu demand riêng để tránh cascade lỗi

    @Override
    @Transactional
    public Long save(CustomerRequestDTO dto, Long customerId) {

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy khách hàng với ID: " + customerId));

        if (dto.getDemand() == null) {
            throw new RuntimeException("Demand không được để trống");
        }

        DemandDTO demandDTO = dto.getDemand();

        // Validate các trường bắt buộc
        if (demandDTO.getArea() == null || demandDTO.getArea() <= 0)
            throw new RuntimeException("Diện tích (area) là bắt buộc");
        if (demandDTO.getPrice() == null || demandDTO.getPrice() <= 0)
            throw new RuntimeException("Giá (price) là bắt buộc");
        if (isBlank(demandDTO.getWard()))
            throw new RuntimeException("Phường/Xã (ward) là bắt buộc");
        if (isBlank(demandDTO.getProvince()))
            throw new RuntimeException("Tỉnh/Thành phố (province) là bắt buộc");
        if (isBlank(demandDTO.getTransactionType()))
            throw new RuntimeException("Loại giao dịch (transactionType) là bắt buộc");
        if (isBlank(demandDTO.getPropertyType()))
            throw new RuntimeException("Loại bất động sản (propertyType) là bắt buộc");
        if (demandDTO.getPriorityType() == null)
            throw new RuntimeException("Loại ưu tiên (priorityType) là bắt buộc");

        // FIX: Tạo DemandEntity và set customer_id TRƯỚC khi save
        // Lỗi 500 xảy ra vì cascade PERSIST lưu demand nhưng customer_id bị null
        DemandEntity demand = new DemandEntity();
        demand.setCustomer(customer);          // ← set FK trước khi save
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

        // FIX: Lưu demand riêng trước để có ID
        DemandEntity savedDemand = demandRepository.save(demand);

        // Tạo CustomerRequestEntity sau khi demand đã có ID
        CustomerRequestEntity entity = new CustomerRequestEntity();
        entity.setCustomer(customer);
        entity.setFullName(customer.getFullName());
        entity.setPhone(customer.getPhone());
        entity.setEmail(customer.getEmail());
        entity.setDemand(savedDemand);
        // FIX: parse String → CustomerStatus enum
        entity.setStatus(dto.getStatus() != null
                ? CustomerStatus.valueOf(dto.getStatus())
                : CustomerStatus.NEW);

        customerRequestRepository.save(entity);

        return customer.getId();
    }

    @Override
    public List<CustomerRequestDTO> getAll() {
        List<CustomerRequestEntity> entities = customerRequestRepository.findAll();
        List<CustomerRequestDTO> result = new ArrayList<>();

        for (CustomerRequestEntity item : entities) {
            CustomerRequestDTO responseDto = new CustomerRequestDTO();
            responseDto.setId(item.getId());

            if (item.getCustomer() != null) {
                responseDto.setCustomerId(item.getCustomer().getId());
                responseDto.setFullName(item.getCustomer().getFullName());
                responseDto.setPhone(item.getCustomer().getPhone());
                responseDto.setEmail(item.getCustomer().getEmail());
            } else {
                responseDto.setFullName(item.getFullName());
                responseDto.setPhone(item.getPhone());
                responseDto.setEmail(item.getEmail());
            }

            responseDto.setStatus(item.getStatus() != null ? item.getStatus().name() : null);
            responseDto.setDemand(toDemandDTO(item.getDemand()));
            result.add(responseDto);
        }
        return result;
    }

    @Override
    public List<CustomerRequestResponseDTO> getCustomerRequestsByStaffId(Long staffId) {
        List<CustomerRequestEntity> entities = customerRequestRepository.findByStaffId(staffId);
        List<CustomerRequestResponseDTO> result = new ArrayList<>();

        for (CustomerRequestEntity entity : entities) {
            CustomerRequestResponseDTO responseDto = new CustomerRequestResponseDTO();
            responseDto.setId(entity.getId());

            if (entity.getCustomer() != null) {
                responseDto.setCustomerId(entity.getCustomer().getId());
                responseDto.setFullName(entity.getCustomer().getFullName());
                responseDto.setPhone(entity.getCustomer().getPhone());
                responseDto.setEmail(entity.getCustomer().getEmail());
            }

            responseDto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
            if (entity.getCreatedDate() != null)
                responseDto.setCreatedDate(entity.getCreatedDate().toString());
            if (entity.getModifiedDate() != null)
                responseDto.setModifiedDate(entity.getModifiedDate().toString());

            responseDto.setDemand(toDemandDTO(entity.getDemand()));
            result.add(responseDto);
        }
        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private DemandDTO toDemandDTO(DemandEntity demand) {
        if (demand == null) return null;
        DemandDTO dto = new DemandDTO();
        dto.setArea(demand.getArea());
        dto.setPrice(demand.getPrice());
        dto.setWard(demand.getWard());
        dto.setProvince(demand.getProvince());
        dto.setTransactionType(demand.getTransactionType());
        dto.setPropertyType(demand.getPropertyType() != null
                ? demand.getPropertyType().name() : null);
        dto.setPriorityType(demand.getPriorityType());
        dto.setNumberOfBasement(demand.getNumberOfBasement());
        dto.setDirection(demand.getDirection());
        dto.setLegalStatus(demand.getLegalStatus());
        dto.setBrokerageFee(demand.getBrokerageFee());
        return dto;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}