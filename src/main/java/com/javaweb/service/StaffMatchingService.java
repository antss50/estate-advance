package com.javaweb.service;

import com.javaweb.model.request.StaffMatchingRequest;
import com.javaweb.model.response.StaffMatchingResponse;

public interface StaffMatchingService {

    /**
     * Tìm staff phù hợp nhất để assign cho khách hàng.
     *
     * @param request chứa customerId, scoreCustomer (đã tính trước),
     *                và các tham số cấu hình (pTarget, lMax, probationDays, topN)
     * @return danh sách staff sắp xếp giảm dần theo Score_CS
     */
    StaffMatchingResponse findMatchingStaff(StaffMatchingRequest request);
}