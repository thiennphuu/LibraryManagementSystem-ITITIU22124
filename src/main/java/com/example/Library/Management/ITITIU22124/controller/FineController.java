package com.example.Library.Management.ITITIU22124.controller;

import com.example.Library.Management.ITITIU22124.model.Fine;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.service.FineService;
import com.example.Library.Management.ITITIU22124.service.FineService.FineStatistics;
import com.example.Library.Management.ITITIU22124.service.FineService.FinePreview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    @Autowired
    private FineService fineService;

    /**
     * Get current user's fines
     */
    @GetMapping("/my-fines")
    public ResponseEntity<List<Fine>> getMyFines(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fineService.getFinesByUser(user.getId()));
    }

    /**
     * Get current user's unpaid fines
     */
    @GetMapping("/my-fines/unpaid")
    public ResponseEntity<List<Fine>> getMyUnpaidFines(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fineService.getUnpaidFinesByUser(user.getId()));
    }

    /**
     * Get current user's fine summary
     */
    @GetMapping("/my-fines/summary")
    public ResponseEntity<Map<String, Object>> getMyFineSummary(@AuthenticationPrincipal User user) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUnpaidAmount", fineService.getTotalUnpaidAmount(user.getId()));
        summary.put("unpaidCount", fineService.getUnpaidFinesCount(user.getId()));
        summary.put("allFines", fineService.getFinesByUser(user.getId()));
        return ResponseEntity.ok(summary);
    }

    /**
     * Pay a specific fine
     */
    @PostMapping("/{id}/pay")
    public ResponseEntity<Fine> payFine(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Fine fine = fineService.getFineById(id);
        // Verify the fine belongs to the user (or user is admin)
        if (!fine.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(fineService.payFine(id));
    }

    /**
     * Pay all unpaid fines for current user
     */
    @PostMapping("/pay-all")
    public ResponseEntity<List<Fine>> payAllFines(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(fineService.payAllFines(user.getId()));
    }

    /**
     * Preview fine calculation
     */
    @GetMapping("/preview")
    public ResponseEntity<FinePreview> previewFine(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate) {
        return ResponseEntity.ok(fineService.previewFine(dueDate, returnDate));
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all fines (Admin)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Fine>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    /**
     * Get all unpaid fines (Admin)
     */
    @GetMapping("/unpaid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Fine>> getAllUnpaidFines() {
        return ResponseEntity.ok(fineService.getAllUnpaidFines());
    }

    /**
     * Get fines for a specific user (Admin)
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Fine>> getFinesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(fineService.getFinesByUser(userId));
    }

    /**
     * Get fine statistics (Admin)
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FineStatistics> getStatistics() {
        return ResponseEntity.ok(fineService.getStatistics());
    }

    /**
     * Waive a fine (Admin)
     */
    @PostMapping("/{id}/waive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Fine> waiveFine(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.waiveFine(id));
    }

    /**
     * Get fine by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Fine> getFineById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Fine fine = fineService.getFineById(id);
        // Verify the fine belongs to the user (or user is admin)
        if (!fine.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(fine);
    }
}
