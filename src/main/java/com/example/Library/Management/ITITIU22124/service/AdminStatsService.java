package com.example.Library.Management.ITITIU22124.service;

import com.example.Library.Management.ITITIU22124.dto.AdminStatsDTO;
import com.example.Library.Management.ITITIU22124.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminStatsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BorrowRepository borrowRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private FineRepository fineRepository;

    public AdminStatsDTO getStats() {
        long totalUsers = userRepository.count();
        long totalBooks = bookRepository.count();
        long totalBorrows = borrowRepository.count();
        long totalReservations = reservationRepository.count();
        long overdueBorrows = borrowRepository.findByDueDateBeforeAndReturnDateIsNull(java.time.LocalDate.now()).size();
        long activeFines = fineRepository
                .findByStatus(com.example.Library.Management.ITITIU22124.model.FineStatus.UNPAID).size();
        return new AdminStatsDTO(totalUsers, totalBooks, totalBorrows, totalReservations, overdueBorrows, activeFines);
    }
}
