package com.example.Library.Management.ITITIU22124.controller;

import com.example.Library.Management.ITITIU22124.model.Reservation;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Map<String, Long> reservationData) {
        Long userId = reservationData.get("userId");
        Long bookId = reservationData.get("bookId");
        return ResponseEntity.ok(reservationService.createReservation(userId, bookId));
    }

    @GetMapping("/user/{userId}")
    public List<Reservation> getReservationsByUser(@PathVariable Long userId) {
        return reservationService.getReservationsByUser(userId);
    }

    @GetMapping("/my-reservations")
    public List<Reservation> getMyReservations(@AuthenticationPrincipal User user) {
        return reservationService.getReservationsByUser(user.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservationAlt(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/ready")
    public ResponseEntity<Reservation> markReady(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.markReady(id));
    }
}
