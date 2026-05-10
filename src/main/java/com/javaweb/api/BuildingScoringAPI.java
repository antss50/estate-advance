package com.javaweb.api;

import com.javaweb.model.dto.BuildingScoreDTO;
import com.javaweb.service.BuildingScoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/building-scoring")
@CrossOrigin(origins = "*")
public class BuildingScoringAPI {

    @Autowired
    private BuildingScoringService scoringService;

    @GetMapping
    public ResponseEntity<?> scoreBuildings(
            @RequestParam String transactionType) {

        // Kiểm tra transactionType
        if (transactionType == null ||
                (!"SALE".equalsIgnoreCase(transactionType) && !"RENT".equalsIgnoreCase(transactionType))) {
            return ResponseEntity.badRequest().body(
                    "{\"error\": \"transactionType phải là SALE hoặc RENT\"}"
            );
        }

        List<BuildingScoreDTO> result = scoringService.scoreAllBuildings(transactionType);
        return ResponseEntity.ok(result);
    }
}