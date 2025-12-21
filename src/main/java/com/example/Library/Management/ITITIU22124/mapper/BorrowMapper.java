package com.example.Library.Management.ITITIU22124.mapper;

import com.example.Library.Management.ITITIU22124.dto.BorrowDTO;
import com.example.Library.Management.ITITIU22124.model.BorrowRecord;
import com.example.Library.Management.ITITIU22124.model.BorrowStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class BorrowMapper {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BookMapper bookMapper;

    public BorrowDTO toDTO(BorrowRecord borrowRecord) {
        if (borrowRecord == null) {
            return null;
        }

        BorrowDTO dto = new BorrowDTO();
        dto.setId(borrowRecord.getId());
        dto.setUser(userMapper.toDTO(borrowRecord.getUser()));
        dto.setBook(bookMapper.toDTO(borrowRecord.getBook()));
        dto.setBorrowDate(borrowRecord.getBorrowDate());
        dto.setDueDate(borrowRecord.getDueDate());
        dto.setReturnDate(borrowRecord.getReturnDate()); // Actual return date
        dto.setStatus(borrowRecord.getStatus().name()); // Convert enum to String

        // Calculate if overdue
        if (borrowRecord.getReturnDate() == null &&
                borrowRecord.getDueDate() != null) {
            LocalDate today = LocalDate.now();
            dto.setOverdue(today.isAfter(borrowRecord.getDueDate()));

            if (dto.isOverdue()) {
                dto.setDaysOverdue(ChronoUnit.DAYS.between(borrowRecord.getDueDate(), today));
            } else {
                dto.setDaysOverdue(0);
            }
        } else {
            dto.setOverdue(false);
            dto.setDaysOverdue(0);
        }

        return dto;
    }

    public BorrowRecord toEntity(BorrowDTO dto) {
        if (dto == null) {
            return null;
        }

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setId(dto.getId());
        borrowRecord.setUser(userMapper.toEntity(dto.getUser()));
        borrowRecord.setBook(bookMapper.toEntity(dto.getBook()));
        borrowRecord.setBorrowDate(dto.getBorrowDate());
        borrowRecord.setDueDate(dto.getDueDate());
        borrowRecord.setReturnDate(dto.getReturnDate());
        borrowRecord.setStatus(BorrowStatus.valueOf(dto.getStatus())); // Convert String to enum

        return borrowRecord;
    }
}
