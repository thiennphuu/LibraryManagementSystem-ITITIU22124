package com.example.Library.Management.ITITIU22124.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private UserDTO user;
    private BookDTO book;
    private LocalDateTime reservationDate;
    private String status; // PENDING, READY, CANCELLED
    private Integer queuePosition; // Position in the reservation queue
    private LocalDateTime estimatedAvailableDate; // Optional: when book might be available
}
