package com.javaweb.api.admin;

import com.javaweb.entity.BuildingEntity;
import com.javaweb.model.dto.AssignmentBuildingDTO;
import com.javaweb.model.dto.BuildingDTO;
import com.javaweb.model.response.ResponseDTO;
import com.javaweb.service.AssignmentBuildingService;
import com.javaweb.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController(value = "buildingAPIOfAdmin")
@RequestMapping("/api/building")
public class BuildingAPI {

    @Autowired
    private BuildingService buildingService;
    @Autowired
    private AssignmentBuildingService assignmentBuildingService;

    @PostMapping
    public ResponseEntity<BuildingDTO> addOrUpdateBuilding(@RequestBody BuildingDTO buildingDTO)
    {
      return ResponseEntity.ok(buildingService.addOrUpdateBuilding(buildingDTO));
    }

    @DeleteMapping("/{ids}")
    public void deleteBuilding(@PathVariable List<Long> ids)
    {
        buildingService.deleteBuilding(ids);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDTO> getBuildingDetail(@PathVariable Long id) {
        BuildingDTO result = buildingService.getBuildingDetail(id);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}/staffs")
    public ResponseDTO getStaffs(@PathVariable Long id)
    {
        ResponseDTO result = buildingService.listStaffs(id);
        return result;
    }

        @GetMapping
    public List<BuildingSearchResponse> getAllBuildings(@ModelAttribute BuildingSearchRequest request) {
        return buildingService.findAll(request);
    }

    @PostMapping("/assignment")
    public ResponseEntity<?> addOrUpdateAssignmentBuilding(@RequestBody AssignmentBuildingDTO requestData) {
        try {
            assignmentBuildingService.addOrUpdateAssignmentBuilding(requestData);


            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Gán nhân viên thành công");

            return ResponseEntity.ok(response);  // ← TRẢ VỀ CHO CLIENT

        } catch (Exception e) {
            // Nếu có lỗi
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }


}
