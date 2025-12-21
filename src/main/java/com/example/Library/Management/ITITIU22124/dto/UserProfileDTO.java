package com.example.Library.Management.ITITIU22124.dto;

import com.example.Library.Management.ITITIU22124.model.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
    private LocalDateTime createdAt;

    // Statistics
    private long borrowedCount; // Total books ever borrowed
    private long currentBorrows; // Currently borrowed (not returned)
    private long reservationCount; // Active reservations
    private long overdueCount; // Overdue books
    private long unpaidFinesCount; // Number of unpaid fines
    private BigDecimal totalUnpaidFines; // Total unpaid fine amount

    public UserProfileDTO() {
    }

    public UserProfileDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole() != null ? user.getRole().name() : "USER";
        this.createdAt = user.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getBorrowedCount() {
        return borrowedCount;
    }

    public void setBorrowedCount(long borrowedCount) {
        this.borrowedCount = borrowedCount;
    }

    public long getCurrentBorrows() {
        return currentBorrows;
    }

    public void setCurrentBorrows(long currentBorrows) {
        this.currentBorrows = currentBorrows;
    }

    public long getReservationCount() {
        return reservationCount;
    }

    public void setReservationCount(long reservationCount) {
        this.reservationCount = reservationCount;
    }

    public long getOverdueCount() {
        return overdueCount;
    }

    public void setOverdueCount(long overdueCount) {
        this.overdueCount = overdueCount;
    }

    public long getUnpaidFinesCount() {
        return unpaidFinesCount;
    }

    public void setUnpaidFinesCount(long unpaidFinesCount) {
        this.unpaidFinesCount = unpaidFinesCount;
    }

    public BigDecimal getTotalUnpaidFines() {
        return totalUnpaidFines;
    }

    public void setTotalUnpaidFines(BigDecimal totalUnpaidFines) {
        this.totalUnpaidFines = totalUnpaidFines;
    }
}
