package com.javaweb.service.impl;

import com.javaweb.config.commission.CommissionCalculator;
import com.javaweb.config.commission.CommissionResult;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.CustomerRequestEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.enums.BuildingStatus;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.enums.TransactionType;
import com.javaweb.model.request.CustomerStatusUpdateRequest;
import com.javaweb.model.response.CustomerStatusUpdateResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.CustomerRequestRepository;
import com.javaweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class CustomerStatusService {

    @Autowired
    private CustomerRequestRepository customerRequestRepository;

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

        // 1. Tìm bản ghi customer_request (ưu tiên customerRequestId)
        CustomerRequestEntity customerRequest = findCustomerRequest(request);

        // Lấy customerId và demandId từ entity (dùng cho response)
        Long customerId = customerRequest.getCustomer() != null ? customerRequest.getCustomer().getId() : null;
        Long demandId = customerRequest.getDemand() != null ? customerRequest.getDemand().getId() : null;

        CustomerStatus currentStatus = customerRequest.getStatus();
        CustomerStatus newStatus = request.getNewStatus();

        // 2. Kiểm tra tính hợp lệ của bước chuyển
        validateTransition(currentStatus, newStatus);

        // 3. Xử lý riêng cho SIGNED → PAID
        CommissionResult commissionResult = null;
        BuildingStatus newBuildingStatus = null;

        if (currentStatus == CustomerStatus.SIGNED && newStatus == CustomerStatus.PAID) {
            validatePaidRequest(request);
            validateStaffOwnsBuilding(request.getStaffId(), request.getBuildingId());
            commissionResult = handleCommission(request);
            newBuildingStatus = handleBuildingStatus(request);
        }

        // 4. Cập nhật trạng thái trên customer_request
        customerRequest.setStatus(newStatus);
        if (customerRequest.getCustomer() != null) {
            customerRequest.getCustomer().setStatus(newStatus);
        }
        customerRequestRepository.save(customerRequest);

        // 5. Xây dựng response
        CustomerStatusUpdateResponse response = new CustomerStatusUpdateResponse();
        response.setCustomerId(customerId);
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

    // ───────────────────── Xử lý hoa hồng (giữ nguyên) ───────────────────────
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

        if (request.getTransactionType() == TransactionType.SALE) {
            BigDecimal currentSaleRevenue = staff.getRevenueSale() != null ? staff.getRevenueSale() : BigDecimal.ZERO;
            staff.setRevenueSale(currentSaleRevenue.add(result.getStaffCommission()));

            int currentSaleDeals = staff.getTotalSaleDeals() != null ? staff.getTotalSaleDeals() : 0;
            staff.setTotalSaleDeals(currentSaleDeals + 1);
        } else {
            BigDecimal currentRentRevenue = staff.getRevenueRent() != null ? staff.getRevenueRent() : BigDecimal.ZERO;
            staff.setRevenueRent(currentRentRevenue.add(result.getStaffCommission()));

            int currentRentDeals = staff.getTotalRentDeals() != null ? staff.getTotalRentDeals() : 0;
            staff.setTotalRentDeals(currentRentDeals + 1);
        }

        userRepository.save(staff);
        return result;
    }

    // ───────────────────── Xử lý trạng thái Building (giữ nguyên) ────────────
    private void validatePaidRequest(CustomerStatusUpdateRequest request) {
        if (request.getStaffId() == null) {
            throw new IllegalArgumentException("staffId bat buoc khi chuyen SIGNED sang PAID");
        }
        if (request.getBuildingId() == null) {
            throw new IllegalArgumentException("buildingId bat buoc khi chuyen SIGNED sang PAID");
        }
        if (request.getTransactionType() == null) {
            throw new IllegalArgumentException("transactionType bat buoc khi chuyen SIGNED sang PAID");
        }

        if (request.getTransactionType() == TransactionType.SALE) {
            if (request.getContractValue() == null || request.getContractValue().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("contractValue phai lon hon 0 cho giao dich SALE");
            }
            return;
        }

        if (request.getMonthlyRent() == null || request.getMonthlyRent().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("monthlyRent phai lon hon 0 cho giao dich RENT");
        }
        if (request.getContractMonths() == null || request.getContractMonths() <= 0) {
            throw new IllegalArgumentException("contractMonths phai lon hon 0 cho giao dich RENT");
        }
    }

    private void validateStaffOwnsBuilding(Long staffId, Long buildingId) {
        BuildingEntity building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay building id: " + buildingId));

        boolean assigned = building.getUsers() != null
                && building.getUsers().stream().anyMatch(staff -> staffId.equals(staff.getId()));

        if (!assigned) {
            throw new IllegalStateException(
                    "Staff id " + staffId + " khong quan ly building id " + buildingId);
        }
    }

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

    // ───────────────────── Kiểm tra luồng trạng thái (giữ nguyên) ────────────
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

    // ───────────────────── Tìm CustomerRequestEntity (hỗ trợ cả 2 cách) ───────
    private CustomerRequestEntity findCustomerRequest(CustomerStatusUpdateRequest request) {
        // Ưu tiên dùng customerRequestId
        if (request.getCustomerRequestId() != null) {
            return customerRequestRepository.findById(request.getCustomerRequestId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Không tìm thấy customer request với id = " + request.getCustomerRequestId()));
        }
        // Dùng cặp customerId + demandId (optional, để tương thích cũ)
        if (request.getCustomerId() != null && request.getDemandId() != null) {
            return customerRequestRepository.findByCustomerIdAndDemandId(request.getCustomerId(), request.getDemandId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            String.format("Không tìm thấy yêu cầu của khách hàng %d với nhu cầu %d",
                                    request.getCustomerId(), request.getDemandId())));
        }
        throw new IllegalArgumentException("Phải cung cấp customerRequestId hoặc cặp (customerId, demandId)");
    }
}
