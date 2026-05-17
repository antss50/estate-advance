package com.javaweb.service.impl;

import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.Demand;
import com.javaweb.model.dto.DemandDTO;
import com.javaweb.model.request.CustomerRequestDTO;
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

        // 1. Lấy customer từ database
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + customerId));

        // 2. Tạo CustomerRequestEntity
        CustomerRequestEntity entity = new CustomerRequestEntity();
        entity.setCustomer(customer);
        entity.setFullName(customer.getFullName());
        entity.setPhone(customer.getPhone());
        entity.setEmail(customer.getEmail());

        // 3. Map DemandDTO -> Demand
        if (dto.getDemand() != null) {
            DemandDTO demandDTO = dto.getDemand();
            Demand demand = new Demand();
            demand.setArea(demandDTO.getArea());
            demand.setPrice(demandDTO.getPrice());
            demand.setWard(demandDTO.getWard());
            demand.setProvince(demandDTO.getProvince());
            demand.setBuildingType(demandDTO.getBuildingType());
            demand.setTransactionType(demandDTO.getTransactionType());
            demand.setPropertyType(demandDTO.getPropertyType());
            demand.setPriorityType(demandDTO.getPriorityType());
            demand.setNumberOfBasement(demandDTO.getNumberOfBasement());
            demand.setDirection(demandDTO.getDirection());
            demand.setLegalStatus(demandDTO.getLegalStatus());
            demand.setBrokerageFee(demandDTO.getBrokerageFee());
            entity.setDemand(demand);
        }

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

            // Lấy customerId và thông tin từ customer
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
                demandDTO.setBuildingType(item.getDemand().getBuildingType());
                demandDTO.setTransactionType(item.getDemand().getTransactionType());
                demandDTO.setPropertyType(item.getDemand().getPropertyType());
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
}