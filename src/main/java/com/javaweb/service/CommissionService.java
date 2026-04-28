package com.javaweb.service;

import com.javaweb.config.CommissionConfig;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.model.dto.CommissionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class CommissionService {

    @Autowired
    private CommissionConfig commissionConfig;

    public CommissionDTO calculateCommission(Long customerId, Long staffId, Long buildingId,
                                             String transactionType, BigDecimal contractValue,
                                             Integer rentMonths, String currentStatus) {

        if (!CustomerStatus.SIGNED.name().equals(currentStatus)) {
            return null;
        }

        CommissionDTO commission = new CommissionDTO();
        commission.setCustomerId(customerId);
        commission.setStaffId(staffId);
        commission.setBuildingId(buildingId);
        commission.setTransactionType(transactionType);
        commission.setContractValue(contractValue);
        commission.setRentMonths(rentMonths);
        commission.setPaidDate(LocalDateTime.now());
        commission.setCustomerStatus(CustomerStatus.PAID.name());

        if ("SALE".equalsIgnoreCase(transactionType)) {
            calculateSaleCommission(commission);
        } else if ("RENT".equalsIgnoreCase(transactionType)) {
            calculateRentCommission(commission);
        }

        return commission;
    }

    private void calculateSaleCommission(CommissionDTO commission) {
        BigDecimal contractValue = commission.getContractValue();

        BigDecimal totalCommission = contractValue.multiply(BigDecimal.valueOf(commissionConfig.getSaleTotalRate()));
        BigDecimal staffCommission = contractValue.multiply(BigDecimal.valueOf(commissionConfig.getSaleStaffRate()));
        BigDecimal systemCommission = contractValue.multiply(BigDecimal.valueOf(commissionConfig.getSaleSystemRate()));

        commission.setTotalCommission(totalCommission.setScale(0, RoundingMode.HALF_UP));
        commission.setStaffCommission(staffCommission.setScale(0, RoundingMode.HALF_UP));
        commission.setSystemCommission(systemCommission.setScale(0, RoundingMode.HALF_UP));
    }

    private void calculateRentCommission(CommissionDTO commission) {
        BigDecimal monthlyRent = commission.getContractValue();
        Integer rentMonths = commission.getRentMonths();
        double staffPercentage = commissionConfig.getRentStaffPercentage();

        BigDecimal totalCommission;

        if (rentMonths != null && rentMonths >= commissionConfig.getRentLongTermMonths()) {
            totalCommission = monthlyRent;
        } else {
            totalCommission = monthlyRent.divide(BigDecimal.valueOf(2), 0, RoundingMode.HALF_UP);
        }

        BigDecimal staffCommission = totalCommission.multiply(BigDecimal.valueOf(staffPercentage))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal systemCommission = totalCommission.subtract(staffCommission)
                .setScale(0, RoundingMode.HALF_UP);

        commission.setTotalCommission(totalCommission.setScale(0, RoundingMode.HALF_UP));
        commission.setStaffCommission(staffCommission);
        commission.setSystemCommission(systemCommission);
    }
}