package com.javaweb.api;

import com.javaweb.model.dto.ProvinceDTO;
import com.javaweb.model.dto.WardDTO;
import com.javaweb.service.impl.AdministrativeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/administrative")
// @CrossOrigin(origins = "*")
public class AdministrativeAPI {

    @Autowired
    private AdministrativeService administrativeService;

    @GetMapping("/provinces")
    public ResponseEntity<List<ProvinceDTO>> getAllProvinces() {
        return ResponseEntity.ok(administrativeService.getAllProvinces());
    }

    @GetMapping("/provinces/{provinceCode}/wards")
    public ResponseEntity<List<WardDTO>> getWardsByProvince(@PathVariable String provinceCode) {
        return ResponseEntity.ok(administrativeService.getWardsByProvinceCode(provinceCode));
    }
}