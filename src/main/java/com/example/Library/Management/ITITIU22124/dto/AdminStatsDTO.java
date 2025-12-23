package com.example.Library.Management.ITITIU22124.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalUsers;
    private long totalBooks;
    private long totalBorrows;
    private long totalReservations;
    private long overdueBorrows;
    private long activeFines;
}
