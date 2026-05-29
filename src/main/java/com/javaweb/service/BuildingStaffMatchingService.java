package com.javaweb.service;

import com.javaweb.model.request.BuildingStaffMatchingRequest;
import com.javaweb.model.response.BuildingStaffMatchingResponse;

public interface BuildingStaffMatchingService {

    /**
     * Tìm staff phù hợp nhất để phụ trách một building.
     *
     * @param request chứa buildingId, monthsInInventory và các tham số cấu hình
     * @return danh sách staff sắp xếp giảm dần theo Score_BS
     */
    BuildingStaffMatchingResponse findMatchingStaff(BuildingStaffMatchingRequest request);
}