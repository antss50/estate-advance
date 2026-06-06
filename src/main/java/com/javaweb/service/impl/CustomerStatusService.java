package com.javaweb.service.impl;

import com.javaweb.config.commission.CommissionCalculator;
import com.javaweb.config.commission.CommissionResult;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.enums.BuildingStatus;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.enums.TransactionType;
import java.time.LocalDate;
import com.javaweb.model.request.CustomerStatusUpdateRequest;
import com.javaweb.model.response.CustomerStatusUpdateResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.CustomerRepository;
import com.javaweb.repository.CustomerRequestRepository;
import com.javaweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Xử lý quy trình chuyển trạng thái:
 *   NEW → ASSIGNED → CONSULTING → SIGNED → PAID
 *
 * Khi SIGNED → PAID (trong 1 @Transactional):
 *   1. Tính hoa hồng (CommissionCalculator)
 *   2. Cộng staffCommission vào UserEntity.revenue
 *   3. Tăng UserEntity.totalDeals thêm 1
 *   4. Tự động đổi BuildingStatus:
 *        RENT → AVAILABLE → RENTED
 *        SALE → AVAILABLE → SOLD
 */
@Service
public class CustomerStatusService {

    @Autowired
    private CustomerRequestRepository customerRequestRepository;  // Dùng repository của customer_request

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    private static final CustomerStatus[] STATUS_FLOW = {
            CustomerStatus.NEW,
            CustomerStatus.ASSIGNED,
            CustomerStatus.CONSULTING,
            CustomerStatus.SIGNED,
            CustomerStatus.PAID
    };

    @Transactional
    public CustomerStatusUpdateResponse updateStatus(CustomerStatusUpdateRequest request) {

        // 1. Tìm bản ghi customer_request theo customerId + demandId
        CustomerRequestEntity customerRequest = customerRequestRepository
                .findByCustomerIdAndDemandId(request.getCustomerId(), request.getDemandId())
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("Không tìm thấy yêu cầu của khách hàng %d với nhu cầu %d",
                                request.getCustomerId(), request.getDemandId())));

        CustomerStatus currentStatus = customerRequest.getStatus();
        CustomerStatus newStatus = request.getNewStatus();

        // 2. Kiểm tra tính hợp lệ của bước chuyển
        validateTransition(currentStatus, newStatus);

        // 3. Xử lý riêng cho SIGNED → PAID
        CommissionResult commissionResult = null;
        BuildingStatus newBuildingStatus = null;

        if (currentStatus == CustomerStatus.SIGNED && newStatus == CustomerStatus.PAID) {
            commissionResult = handleCommission(request);
            newBuildingStatus = handleBuildingStatus(request);
        }

        // 4. Cập nhật trạng thái trên customer_request
        customerRequest.setStatus(newStatus);
        customerRequestRepository.save(customerRequest);

        // 5. Xây dựng response
        CustomerStatusUpdateResponse response = new CustomerStatusUpdateResponse();
        response.setCustomerId(request.getCustomerId());
        response.setOldStatus(currentStatus.name());
        response.setNewStatus(newStatus.name());
        response.setSuccess(true);

        if (commissionResult != null) {
            response.setTotalCommission(commissionResult.getTotalCommission());
            response.setStaffCommission(commissionResult.getStaffCommission());
            response.setSystemCommission(commissionResult.getSystemCommission());
            response.setCommissionDescription(commissionResult.getDescription());
        }
        if (newBuildingStatus != null) {
            response.setBuildingId(request.getBuildingId());
            response.setBuildingStatus(newBuildingStatus.name());
        }

        return response;
    }

    // ───────────────────── Xử lý hoa hồng (giữ nguyên logic cũ) ───────────────
    private CommissionResult handleCommission(CustomerStatusUpdateRequest request) {
        UserEntity staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy staff id: " + request.getStaffId()));

        CommissionResult result;
        if (request.getTransactionType() == TransactionType.SALE) {
            result = CommissionCalculator.forSale(request.getContractValue());
        } else {
            result = CommissionCalculator.forRent(request.getMonthlyRent(), request.getContractMonths());
        }

        BigDecimal currentRevenue = staff.getRevenue() != null ? staff.getRevenue() : BigDecimal.ZERO;
        staff.setRevenue(currentRevenue.add(result.getStaffCommission()));

        int currentDeals = staff.getTotalDeals() != null ? staff.getTotalDeals() : 0;
        staff.setTotalDeals(currentDeals + 1);

        userRepository.save(staff);
        return result;
    }

    // ───────────────────── Xử lý trạng thái Building (giữ nguyên logic cũ) ────
    private BuildingStatus handleBuildingStatus(CustomerStatusUpdateRequest request) {
        if (request.getBuildingId() == null) return null;

        BuildingEntity building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy building id: " + request.getBuildingId()));

        if (building.getBuildingStatus() != BuildingStatus.AVAILABLE) {
            throw new IllegalStateException(String.format(
                    "Building id %d đang ở trạng thái %s, không thể giao dịch.",
                    building.getId(), building.getBuildingStatus()));
        }

        BuildingStatus newStatus = (request.getTransactionType() == TransactionType.SALE)
                ? BuildingStatus.SOLD
                : BuildingStatus.RENTED;

        building.setBuildingStatus(newStatus);

        if (newStatus == BuildingStatus.RENTED && request.getContractMonths() != null) {
            LocalDate start = LocalDate.now();
            building.setRentStartDate(start);
            building.setRentEndDate(start.plusMonths(request.getContractMonths()));
        }

        buildingRepository.save(building);
        return newStatus;
    }

    // ───────────────────── Kiểm tra luồng trạng thái ─────────────────────────
    private void validateTransition(CustomerStatus from, CustomerStatus to) {
        int fromIdx = indexOf(from);
        int toIdx = indexOf(to);
        if (fromIdx < 0 || toIdx < 0) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ");
        }
        if (toIdx != fromIdx + 1) {
            throw new IllegalStateException(String.format(
                    "Không thể chuyển từ %s sang %s. Trạng thái tiếp theo phải là: %s",
                    from, to, STATUS_FLOW[fromIdx + 1]));
        }
    }

    private int indexOf(CustomerStatus status) {
        for (int i = 0; i < STATUS_FLOW.length; i++) {
            if (STATUS_FLOW[i] == status) return i;
        }
        return -1;
    }
}