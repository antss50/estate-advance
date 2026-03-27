package com.javaweb.service.impl;

import com.javaweb.entity.AssignmentCustomerEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.model.dto.CustomerDTO;
import com.javaweb.repository.AssignmentCustomerRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AssignmentCustomerRepository assignmentCustomerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CustomerDTO> findAll() {
        return customerRepository.findAll().stream()
                .map(item -> modelMapper.map(item, CustomerDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> findByStaffId(Long staffId) {
        List<AssignmentCustomerEntity> assignments = assignmentCustomerRepository.findByStaff_Id(staffId);

        return assignments.stream()
                .map(item -> modelMapper.map(item.getCustomer(), CustomerDTO.class))
                .collect(Collectors.toList());
    }
}
