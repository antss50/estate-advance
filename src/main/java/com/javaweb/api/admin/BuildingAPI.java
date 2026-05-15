package com.javaweb.api.admin;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.request.BuildingSearchRequest;
import com.javaweb.model.response.BuildingByStaffResponse;
import com.javaweb.model.response.BuildingSearchResponse;
import com.javaweb.model.response.ResponseDTO;
import com.javaweb.service.AssignmentBuildingService;
import com.javaweb.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController(value = "buildingAPIOfAdmin")
@RequestMapping("/api/building")
@CrossOrigin(origins = "*")
public class BuildingAPI {

    @Autowired
    private BuildingService buildingService;

    @Autowired
    private AssignmentBuildingService assignmentBuildingService;

    /**
     * Thêm mới hoặc cập nhật building
     * POST /api/building
     */
    @PostMapping
    public ResponseEntity<BuildingDTO> addOrUpdateBuilding(@RequestBody BuildingDTO buildingDTO) {
        return ResponseEntity.ok(buildingService.addOrUpdateBuilding(buildingDTO));
    }

    /**
     * Gán nhân viên cho building
     * POST /api/building/assignment
     */
    @PostMapping("/assignment")
    public ResponseEntity<?> assignBuilding(@RequestBody AssignmentBuildingDTO dto) {
        buildingService.assignBuilding(dto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Gán nhân viên thành công");
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa building theo danh sách id
     * DELETE /api/building/{ids}
     */
    @DeleteMapping("/{ids}")
    public void deleteBuilding(@PathVariable List<Long> ids) {
        buildingService.deleteBuilding(ids);
    }

    /**
     * Lấy chi tiết building theo id
     * GET /api/building/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BuildingDTO> getBuildingDetail(@PathVariable Long id) {
        BuildingDTO result = buildingService.getBuildingDetail(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Lấy danh sách staff của building
     * GET /api/building/{id}/staffs
     */
    @GetMapping("/{id}/staffs")
    public ResponseDTO getStaffs(@PathVariable Long id) {
        ResponseDTO result = buildingService.listStaffs(id);
        return result;
    }

    /**
     * Lấy danh sách building theo điều kiện tìm kiếm
     * GET /api/building
     */
    @GetMapping
    public List<BuildingSearchResponse> getAllBuildings(@ModelAttribute BuildingSearchRequest request) {
        return buildingService.findAll(request);
    }

    // ============ API MỚI: Lấy building theo staffId ============

    /**
     * Lấy danh sách tòa nhà mà nhân viên đang quản lý
     * GET /api/building/staff/{staffId}
     *
     * @param staffId ID của nhân viên
     * @return Danh sách tòa nhà
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<BuildingByStaffResponse>> getBuildingsByStaffId(
            @PathVariable Long staffId) {
        List<BuildingByStaffResponse> buildings = buildingService.getBuildingsByStaffId(staffId);
        return ResponseEntity.ok(buildings);
    }

    // ============ END API MỚI ============
}