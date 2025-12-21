package com.example.Library.Management.ITITIU22124.repository;

import com.example.Library.Management.ITITIU22124.model.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserId(Long userId);

    List<BorrowRecord> findByBookId(Long bookId);

    List<BorrowRecord> findByStatus(String status);

    List<BorrowRecord> findByDueDateBeforeAndReturnDateIsNull(LocalDate date);

    boolean existsByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);

    // Count total borrows for a user
    long countByUserId(Long userId);

    // Count current borrows (not returned)
    long countByUserIdAndReturnDateIsNull(Long userId);

    // Count overdue books for a user
    long countByUserIdAndDueDateBeforeAndReturnDateIsNull(Long userId, LocalDate date);
}
