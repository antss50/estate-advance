package com.javaweb.service.impl;

import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.Demand;  // Import class Demand (Embeddable)
import com.javaweb.model.dto.DemandDTO;
import com.javaweb.model.request.CustomerRequestDTO;
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

    @Override
    public void save(CustomerRequestDTO dto) {

        CustomerRequestEntity entity = new CustomerRequestEntity();

        entity.setFullName(dto.getFullName());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());

        // ===== MAP DemandDTO -> Demand (Embeddable) =====
        if (dto.getDemand() != null) {
            Demand demand = new Demand();  // Dùng Demand, không phải DemandEntity
            demand.setArea(dto.getDemand().getArea());
            demand.setPrice(dto.getDemand().getPrice());

            // Địa chỉ
            demand.setWard(dto.getDemand().getWard());
            demand.setProvince(dto.getDemand().getProvince());

            // Loại hình
            demand.setBuildingType(dto.getDemand().getBuildingType());
            demand.setTransactionType(dto.getDemand().getTransactionType());
            demand.setPropertyType(dto.getDemand().getPropertyType());
            demand.setPriorityType(dto.getDemand().getPriorityType());

            // Thông tin bổ sung
            demand.setNumberOfBasement(dto.getDemand().getNumberOfBasement());
            demand.setDirection(dto.getDemand().getDirection());
            demand.setLegalStatus(dto.getDemand().getLegalStatus());
            demand.setBrokerageFee(dto.getDemand().getBrokerageFee());

            entity.setDemand(demand);

            // Map các field cấp cao
            if (dto.getPriorityType() != null) {
                entity.setPriorityType(dto.getPriorityType());
            }
            if (dto.getTransactionType() != null) {
                entity.setTransactionType(dto.getTransactionType().name());
            }
            if (dto.getPropertyType() != null) {
                entity.setPropertyType(dto.getPropertyType().name());
            }
        }

        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "NEW");

        customerRequestRepository.save(entity);
    }

    public List<CustomerRequestDTO> getAll() {

        List<CustomerRequestEntity> entities = customerRequestRepository.findAll();
        List<CustomerRequestDTO> result = new ArrayList<>();

        for (CustomerRequestEntity item : entities) {

            CustomerRequestDTO dto = new CustomerRequestDTO();

            dto.setId(item.getId());
            dto.setFullName(item.getFullName());
            dto.setPhone(item.getPhone());
            dto.setEmail(item.getEmail());
            dto.setStatus(item.getStatus());

            // Map các field cấp cao
            dto.setPriorityType(item.getPriorityType());
            if (item.getTransactionType() != null) {
                try {
                    dto.setTransactionType(com.javaweb.enums.TransactionType.valueOf(item.getTransactionType()));
                } catch (IllegalArgumentException e) {}
            }
            if (item.getPropertyType() != null) {
                try {
                    dto.setPropertyType(com.javaweb.enums.TypeCode.valueOf(item.getPropertyType()));
                } catch (IllegalArgumentException e) {}
            }

            if (item.getDemand() != null) {
                DemandDTO demandDTO = new DemandDTO();

                demandDTO.setArea(item.getDemand().getArea());
                demandDTO.setPrice(item.getDemand().getPrice());

                // Địa chỉ
                demandDTO.setWard(item.getDemand().getWard());
                demandDTO.setProvince(item.getDemand().getProvince());

                // Loại hình
                demandDTO.setBuildingType(item.getDemand().getBuildingType());
                demandDTO.setTransactionType(item.getDemand().getTransactionType());
                demandDTO.setPropertyType(item.getDemand().getPropertyType());
                demandDTO.setPriorityType(item.getDemand().getPriorityType());

                // Thông tin bổ sung
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