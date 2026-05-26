package com.javaweb.service;

import com.javaweb.model.request.CustomerMatchingRequest;
import com.javaweb.model.response.CustomerMatchingResponse;

public interface CustomerBuildingMatchingService {

    /**
     * Tìm danh sách building phù hợp nhất với nhu cầu khách hàng.
     *
     * @param request thông tin nhu cầu + cấu hình matching
     * @return danh sách building được sắp xếp giảm dần theo điểm matching
     */
    CustomerMatchingResponse findMatchingBuildings(CustomerMatchingRequest request);
}