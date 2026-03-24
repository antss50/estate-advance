package com.javaweb.service.impl;

import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.Demand;
import com.javaweb.model.request.CustomerRequestDTO;
import com.javaweb.repository.CustomerRequestRepository;
import com.javaweb.service.CustomerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        // ===== MAP DemandDTO -> Demand =====
        if (dto.getDemand() != null) {
            Demand demand = new Demand();
            demand.setArea(dto.getDemand().getArea());
            demand.setPrice(dto.getDemand().getPrice());
            demand.setLocation(dto.getDemand().getLocation());

            entity.setDemand(demand);
        }

        entity.setStatus("NEW");

        customerRequestRepository.save(entity);
    }
}