package com.javaweb.service.impl;

import com.javaweb.entity.CustomerRequestEntity;
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
        entity.setDemand(dto.getDemand());
        entity.setStatus("NEW");
        customerRequestRepository.save(entity);
    }
}
