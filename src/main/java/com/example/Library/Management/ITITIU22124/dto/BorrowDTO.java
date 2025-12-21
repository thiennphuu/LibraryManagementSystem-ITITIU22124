package com.example.Library.Management.ITITIU22124.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDTO {
    private Long id;
    private UserDTO user;
    private BookDTO book;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate; // Actual return date
    private String status; // BORROWED, RETURNED
    private boolean isOverdue; // Computed field
    private long daysOverdue; // Computed field
}
