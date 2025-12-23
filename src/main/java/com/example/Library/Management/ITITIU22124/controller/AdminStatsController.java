package com.example.Library.Management.ITITIU22124.controller;

import com.example.Library.Management.ITITIU22124.dto.AdminStatsDTO;
import com.example.Library.Management.ITITIU22124.service.AdminStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {
    @Autowired
    private AdminStatsService adminStatsService;

    @GetMapping
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminStatsService.getStats());
    }
}
