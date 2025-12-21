package com.example.Library.Management.ITITIU22124.service;

import com.example.Library.Management.ITITIU22124.exception.BadRequestException;
import com.example.Library.Management.ITITIU22124.exception.NotFoundException;
import com.example.Library.Management.ITITIU22124.model.*;
import com.example.Library.Management.ITITIU22124.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class FineService {

    @Autowired
    private FineRepository fineRepository;

    // Configurable fine rate (default: $0.50 per day)
    @Value("${library.fine.daily-rate:0.50}")
    private BigDecimal dailyFineRate;

    // Maximum fine cap (default: $25.00)
    @Value("${library.fine.max-amount:25.00}")
    private BigDecimal maxFineAmount;

    // Grace period in days before fines start (default: 0)
    @Value("${library.fine.grace-period:0}")
    private int gracePeriodDays;

    /**
     * Calculate and create a fine for an overdue book return
     */
    @Transactional
    public Fine calculateAndCreateFine(BorrowRecord borrowRecord, LocalDate returnDate) {
        // Check if fine already exists for this borrow record
        if (fineRepository.existsByBorrowRecordId(borrowRecord.getId())) {
            return fineRepository.findByBorrowRecordId(borrowRecord.getId()).orElse(null);
        }

        LocalDate dueDate = borrowRecord.getDueDate();

        // Calculate days overdue (accounting for grace period)
        long daysOverdue = ChronoUnit.DAYS.between(dueDate, returnDate) - gracePeriodDays;

        if (daysOverdue <= 0) {
            return null; // Not overdue or within grace period
        }

        // Calculate fine amount
        BigDecimal fineAmount = dailyFineRate.multiply(BigDecimal.valueOf(daysOverdue));

        // Apply maximum cap
        if (fineAmount.compareTo(maxFineAmount) > 0) {
            fineAmount = maxFineAmount;
        }

        // Create fine record
        Fine fine = new Fine();
        fine.setUser(borrowRecord.getUser());
        fine.setBorrowRecord(borrowRecord);
        fine.setAmount(fineAmount);
        fine.setDaysOverdue((int) daysOverdue);
        fine.setDailyRate(dailyFineRate);
        fine.setDueDate(dueDate);
        fine.setReturnDate(returnDate);
        fine.setStatus(FineStatus.UNPAID);

        return fineRepository.save(fine);
    }

    /**
     * Get all fines for a user
     */
    public List<Fine> getFinesByUser(Long userId) {
        return fineRepository.findByUserId(userId);
    }

    /**
     * Get unpaid fines for a user
     */
    public List<Fine> getUnpaidFinesByUser(Long userId) {
        return fineRepository.findByUserIdAndStatus(userId, FineStatus.UNPAID);
    }

    /**
     * Get total unpaid fine amount for a user
     */
    public BigDecimal getTotalUnpaidAmount(Long userId) {
        return fineRepository.getTotalUnpaidFinesByUserId(userId);
    }

    /**
     * Get count of unpaid fines for a user
     */
    public long getUnpaidFinesCount(Long userId) {
        return fineRepository.countUnpaidFinesByUserId(userId);
    }

    /**
     * Pay a fine
     */
    @Transactional
    public Fine payFine(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new NotFoundException("Fine not found with id: " + fineId));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new BadRequestException("Fine is already paid");
        }

        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new BadRequestException("Fine has been waived");
        }

        fine.setStatus(FineStatus.PAID);
        fine.setPaidAt(LocalDateTime.now());
        return fineRepository.save(fine);
    }

    /**
     * Pay all unpaid fines for a user
     */
    @Transactional
    public List<Fine> payAllFines(Long userId) {
        List<Fine> unpaidFines = fineRepository.findByUserIdAndStatus(userId, FineStatus.UNPAID);
        LocalDateTime now = LocalDateTime.now();

        for (Fine fine : unpaidFines) {
            fine.setStatus(FineStatus.PAID);
            fine.setPaidAt(now);
        }

        return fineRepository.saveAll(unpaidFines);
    }

    /**
     * Waive a fine (Admin only)
     */
    @Transactional
    public Fine waiveFine(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new NotFoundException("Fine not found with id: " + fineId));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new BadRequestException("Cannot waive a paid fine");
        }

        fine.setStatus(FineStatus.WAIVED);
        return fineRepository.save(fine);
    }

    /**
     * Get all fines (Admin)
     */
    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    /**
     * Get all unpaid fines (Admin)
     */
    public List<Fine> getAllUnpaidFines() {
        return fineRepository.findByStatus(FineStatus.UNPAID);
    }

    /**
     * Get fine by ID
     */
    public Fine getFineById(Long id) {
        return fineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fine not found with id: " + id));
    }

    /**
     * Get fine statistics (Admin)
     */
    public FineStatistics getStatistics() {
        FineStatistics stats = new FineStatistics();
        stats.setTotalUnpaidAmount(fineRepository.getTotalUnpaidFines());
        stats.setTotalCollectedAmount(fineRepository.getTotalCollectedFines());
        stats.setTotalUnpaidCount(fineRepository.findByStatus(FineStatus.UNPAID).size());
        stats.setTotalPaidCount(fineRepository.findByStatus(FineStatus.PAID).size());
        stats.setDailyRate(dailyFineRate);
        stats.setMaxAmount(maxFineAmount);
        stats.setGracePeriodDays(gracePeriodDays);
        return stats;
    }

    /**
     * Preview fine calculation without creating
     */
    public FinePreview previewFine(LocalDate dueDate, LocalDate returnDate) {
        long daysOverdue = ChronoUnit.DAYS.between(dueDate, returnDate) - gracePeriodDays;

        FinePreview preview = new FinePreview();
        preview.setDueDate(dueDate);
        preview.setReturnDate(returnDate);
        preview.setDailyRate(dailyFineRate);
        preview.setGracePeriodDays(gracePeriodDays);

        if (daysOverdue <= 0) {
            preview.setDaysOverdue(0);
            preview.setAmount(BigDecimal.ZERO);
            preview.setOverdue(false);
        } else {
            preview.setDaysOverdue((int) daysOverdue);
            BigDecimal amount = dailyFineRate.multiply(BigDecimal.valueOf(daysOverdue));
            if (amount.compareTo(maxFineAmount) > 0) {
                amount = maxFineAmount;
                preview.setCapped(true);
            }
            preview.setAmount(amount);
            preview.setOverdue(true);
        }

        return preview;
    }

    // Inner classes for statistics and preview
    public static class FineStatistics {
        private BigDecimal totalUnpaidAmount;
        private BigDecimal totalCollectedAmount;
        private int totalUnpaidCount;
        private int totalPaidCount;
        private BigDecimal dailyRate;
        private BigDecimal maxAmount;
        private int gracePeriodDays;

        // Getters and Setters
        public BigDecimal getTotalUnpaidAmount() {
            return totalUnpaidAmount;
        }

        public void setTotalUnpaidAmount(BigDecimal totalUnpaidAmount) {
            this.totalUnpaidAmount = totalUnpaidAmount;
        }

        public BigDecimal getTotalCollectedAmount() {
            return totalCollectedAmount;
        }

        public void setTotalCollectedAmount(BigDecimal totalCollectedAmount) {
            this.totalCollectedAmount = totalCollectedAmount;
        }

        public int getTotalUnpaidCount() {
            return totalUnpaidCount;
        }

        public void setTotalUnpaidCount(int totalUnpaidCount) {
            this.totalUnpaidCount = totalUnpaidCount;
        }

        public int getTotalPaidCount() {
            return totalPaidCount;
        }

        public void setTotalPaidCount(int totalPaidCount) {
            this.totalPaidCount = totalPaidCount;
        }

        public BigDecimal getDailyRate() {
            return dailyRate;
        }

        public void setDailyRate(BigDecimal dailyRate) {
            this.dailyRate = dailyRate;
        }

        public BigDecimal getMaxAmount() {
            return maxAmount;
        }

        public void setMaxAmount(BigDecimal maxAmount) {
            this.maxAmount = maxAmount;
        }

        public int getGracePeriodDays() {
            return gracePeriodDays;
        }

        public void setGracePeriodDays(int gracePeriodDays) {
            this.gracePeriodDays = gracePeriodDays;
        }
    }

    public static class FinePreview {
        private LocalDate dueDate;
        private LocalDate returnDate;
        private int daysOverdue;
        private BigDecimal amount;
        private BigDecimal dailyRate;
        private int gracePeriodDays;
        private boolean isOverdue;
        private boolean isCapped;

        // Getters and Setters
        public LocalDate getDueDate() {
            return dueDate;
        }

        public void setDueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
        }

        public LocalDate getReturnDate() {
            return returnDate;
        }

        public void setReturnDate(LocalDate returnDate) {
            this.returnDate = returnDate;
        }

        public int getDaysOverdue() {
            return daysOverdue;
        }

        public void setDaysOverdue(int daysOverdue) {
            this.daysOverdue = daysOverdue;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public BigDecimal getDailyRate() {
            return dailyRate;
        }

        public void setDailyRate(BigDecimal dailyRate) {
            this.dailyRate = dailyRate;
        }

        public int getGracePeriodDays() {
            return gracePeriodDays;
        }

        public void setGracePeriodDays(int gracePeriodDays) {
            this.gracePeriodDays = gracePeriodDays;
        }

        public boolean isOverdue() {
            return isOverdue;
        }

        public void setOverdue(boolean overdue) {
            isOverdue = overdue;
        }

        public boolean isCapped() {
            return isCapped;
        }

        public void setCapped(boolean capped) {
            isCapped = capped;
        }
    }
}
