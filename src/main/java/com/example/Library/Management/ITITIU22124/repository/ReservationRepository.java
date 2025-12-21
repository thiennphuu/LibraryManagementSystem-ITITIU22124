package com.example.Library.Management.ITITIU22124.repository;

import com.example.Library.Management.ITITIU22124.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByBookId(Long bookId);

    List<Reservation> findByBookIdAndStatusOrderByReservationDateAsc(Long bookId,
            com.example.Library.Management.ITITIU22124.model.ReservationStatus status);

    Reservation findTopByBookIdAndStatusOrderByReservationDateAsc(Long bookId,
            com.example.Library.Management.ITITIU22124.model.ReservationStatus status);

    List<Reservation> findByUserIdAndStatus(Long userId,
            com.example.Library.Management.ITITIU22124.model.ReservationStatus status);

    // Count active reservations (PENDING or READY status)
    long countByUserIdAndStatusIn(Long userId,
            java.util.List<com.example.Library.Management.ITITIU22124.model.ReservationStatus> statuses);
}
