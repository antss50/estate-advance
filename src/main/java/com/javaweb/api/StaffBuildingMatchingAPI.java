//package com.javaweb.api;
//
//import com.javaweb.model.response.StaffMatchScore;
//import com.javaweb.service.StaffBuildingMatchingService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/staff-building-matching")
//// @CrossOrigin(origins = "*")
//public class StaffBuildingMatchingAPI {
//
//    @Autowired
//    private StaffBuildingMatchingService matchingService;
//
//    @GetMapping("/building/{buildingId}")
//    public ResponseEntity<List<StaffMatchScore>> findBestStaffForBuilding(
//            @PathVariable Long buildingId,
//            @RequestParam(defaultValue = "5") int limit) {
//
//        List<StaffMatchScore> result = matchingService.findBestStaffForBuilding(buildingId, limit);
//        return ResponseEntity.ok(result);
//    }
//}