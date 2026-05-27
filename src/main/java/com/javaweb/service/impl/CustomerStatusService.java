package com.javaweb.service.impl;

import com.javaweb.config.commission.CommissionCalculator;
import com.javaweb.config.commission.CommissionResult;
import com.javaweb.entity.BuildingEntity;
import com.javaweb.entity.CustomerEntity;
import com.javaweb.entity.UserEntity;
import com.javaweb.enums.BuildingStatus;
import com.javaweb.enums.CustomerStatus;
import com.javaweb.enums.TransactionType;
import java.time.LocalDate;
import com.javaweb.model.request.CustomerStatusUpdateRequest;
import com.javaweb.model.response.CustomerStatusUpdateResponse;
import com.javaweb.repository.BuildingRepository;
import com.javaweb.repository.CustomerRepository;
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
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    // ── Danh sách trạng thái hợp lệ theo thứ tự ──────────────────────────────
    private static final CustomerStatus[] STATUS_FLOW = {
            CustomerStatus.NEW,
            CustomerStatus.ASSIGNED,
            CustomerStatus.CONSULTING,
            CustomerStatus.SIGNED,
            CustomerStatus.PAID
    };

    // ── Cập nhật trạng thái ───────────────────────────────────────────────────

    @Transactional
    public CustomerStatusUpdateResponse updateStatus(CustomerStatusUpdateRequest request) {

        // 1. Load customer
        CustomerEntity customer = customerRepository
                .findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng id: " + request.getCustomerId()));

        CustomerStatus currentStatus = customer.getStatus();
        CustomerStatus newStatus     = request.getNewStatus();

        // 2. Validate chuyển trạng thái hợp lệ
        validateTransition(currentStatus, newStatus);

        // 3. Xử lý đặc biệt SIGNED → PAID
        CommissionResult commissionResult = null;
        BuildingStatus   newBuildingStatus = null;

        if (currentStatus == CustomerStatus.SIGNED && newStatus == CustomerStatus.PAID) {
            // 3a. Tính hoa hồng + cập nhật doanh thu Staff
            commissionResult = handleCommission(request);

            // 3b. Tự động đổi trạng thái Building
            newBuildingStatus = handleBuildingStatus(request);
        }

        // 4. Cập nhật trạng thái Customer
        customer.setStatus(newStatus);
        customerRepository.save(customer);

        // 5. Đóng gói response
        CustomerStatusUpdateResponse response = new CustomerStatusUpdateResponse();
        response.setCustomerId(customer.getId());
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

    // ── Xử lý hoa hồng ───────────────────────────────────────────────────────

    private CommissionResult handleCommission(CustomerStatusUpdateRequest request) {
        UserEntity staff = userRepository
                .findById(request.getStaffId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy staff id: " + request.getStaffId()));

        CommissionResult result;
        if (request.getTransactionType() == TransactionType.SALE) {
            result = CommissionCalculator.forSale(request.getContractValue());
        } else {
            result = CommissionCalculator.forRent(
                    request.getMonthlyRent(),
                    request.getContractMonths());
        }

        // Cộng doanh thu cá nhân
        BigDecimal currentRevenue = staff.getRevenue() != null ? staff.getRevenue() : BigDecimal.ZERO;
        staff.setRevenue(currentRevenue.add(result.getStaffCommission()));

        // Tăng số deal
        int currentDeals = staff.getTotalDeals() != null ? staff.getTotalDeals() : 0;
        staff.setTotalDeals(currentDeals + 1);

        userRepository.save(staff);
        return result;
    }

    // ── Tự động đổi trạng thái Building ──────────────────────────────────────

    /**
     * RENT → Building chuyển sang RENTED
     * SALE → Building chuyển sang SOLD
     *
     * Nếu buildingId null → bỏ qua (không bắt buộc)
     * Nếu building đã RENTED/SOLD → ném lỗi (tránh giao dịch trùng)
     */
    private BuildingStatus handleBuildingStatus(CustomerStatusUpdateRequest request) {
        if (request.getBuildingId() == null) return null;

        BuildingEntity building = buildingRepository
                .findById(request.getBuildingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy building id: " + request.getBuildingId()));

        // Kiểm tra building còn available không
        if (building.getBuildingStatus() != BuildingStatus.AVAILABLE) {
            throw new IllegalStateException(String.format(
                    "Building id %d hiện đang ở trạng thái %s, không thể giao dịch.",
                    building.getId(), building.getBuildingStatus()
            ));
        }

        // Đổi trạng thái theo loại giao dịch
        BuildingStatus newStatus = (request.getTransactionType() == TransactionType.SALE)
                ? BuildingStatus.SOLD
                : BuildingStatus.RENTED;

        building.setBuildingStatus(newStatus);

        // Nếu là RENT → lưu ngày bắt đầu & kết thúc hợp đồng
        if (newStatus == BuildingStatus.RENTED && request.getContractMonths() != null) {
            LocalDate startDate = LocalDate.now();
            LocalDate endDate   = startDate.plusMonths(request.getContractMonths());
            building.setRentStartDate(startDate);
            building.setRentEndDate(endDate);
        }

        buildingRepository.save(building);

        return newStatus;
    }

    // ── Validate chuyển trạng thái ────────────────────────────────────────────

    private void validateTransition(CustomerStatus from, CustomerStatus to) {
        int fromIndex = indexOf(from);
        int toIndex   = indexOf(to);

        if (fromIndex < 0 || toIndex < 0) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ");
        }
        if (toIndex != fromIndex + 1) {
            throw new IllegalStateException(String.format(
                    "Không thể chuyển từ %s sang %s. Trạng thái tiếp theo phải là: %s",
                    from, to, STATUS_FLOW[fromIndex + 1]
            ));
        }
    }

    private int indexOf(CustomerStatus status) {
        for (int i = 0; i < STATUS_FLOW.length; i++) {
            if (STATUS_FLOW[i] == status) return i;
        }
        return -1;
    }
}