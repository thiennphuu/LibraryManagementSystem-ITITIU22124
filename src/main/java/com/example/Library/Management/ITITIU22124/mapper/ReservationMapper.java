package com.example.Library.Management.ITITIU22124.mapper;

import com.example.Library.Management.ITITIU22124.dto.ReservationDTO;
import com.example.Library.Management.ITITIU22124.model.Reservation;
import com.example.Library.Management.ITITIU22124.model.ReservationStatus;
import com.example.Library.Management.ITITIU22124.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservationMapper {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BookMapper bookMapper;

    @Autowired
    private ReservationRepository reservationRepository;

    public ReservationDTO toDTO(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setUser(userMapper.toDTO(reservation.getUser()));
        dto.setBook(bookMapper.toDTO(reservation.getBook()));
        dto.setReservationDate(reservation.getReservationDate());
        dto.setStatus(reservation.getStatus().name()); // Enum to String for DTO

        // Calculate queue position for PENDING reservations
        if (ReservationStatus.PENDING.equals(reservation.getStatus())) {
            List<Reservation> pendingReservations = reservationRepository
                    .findByBookIdAndStatusOrderByReservationDateAsc(
                            reservation.getBook().getId(),
                            ReservationStatus.PENDING);

            int position = 1;
            for (Reservation r : pendingReservations) {
                if (r.getId().equals(reservation.getId())) {
                    dto.setQueuePosition(position);
                    break;
                }
                position++;
            }
        } else {
            dto.setQueuePosition(null); // Not in queue
        }

        // Estimated available date could be calculated based on average return time
        // For now, we'll leave it null
        dto.setEstimatedAvailableDate(null);

        return dto;
    }

    public Reservation toEntity(ReservationDTO dto) {
        if (dto == null) {
            return null;
        }

        Reservation reservation = new Reservation();
        reservation.setId(dto.getId());
        reservation.setUser(userMapper.toEntity(dto.getUser()));
        reservation.setBook(bookMapper.toEntity(dto.getBook()));
        reservation.setReservationDate(dto.getReservationDate());
        if (dto.getStatus() != null) {
            reservation.setStatus(ReservationStatus.valueOf(dto.getStatus())); // String to enum
        } else {
            reservation.setStatus(null);
        }
        return reservation;
    }
}
