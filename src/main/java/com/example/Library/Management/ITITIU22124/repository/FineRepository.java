package com.example.Library.Management.ITITIU22124.repository;

import com.example.Library.Management.ITITIU22124.model.Fine;
import com.example.Library.Management.ITITIU22124.model.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    List<Fine> findByUserId(Long userId);

    List<Fine> findByUserIdAndStatus(Long userId, FineStatus status);

    List<Fine> findByStatus(FineStatus status);

    Optional<Fine> findByBorrowRecordId(Long borrowRecordId);

    boolean existsByBorrowRecordId(Long borrowRecordId);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.user.id = :userId AND f.status = 'UNPAID'")
    BigDecimal getTotalUnpaidFinesByUserId(Long userId);

    @Query("SELECT COUNT(f) FROM Fine f WHERE f.user.id = :userId AND f.status = 'UNPAID'")
    long countUnpaidFinesByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.status = 'UNPAID'")
    BigDecimal getTotalUnpaidFines();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.status = 'PAID'")
    BigDecimal getTotalCollectedFines();
}
