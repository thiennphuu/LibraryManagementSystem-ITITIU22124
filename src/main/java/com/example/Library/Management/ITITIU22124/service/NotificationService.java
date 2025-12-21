package com.example.Library.Management.ITITIU22124.service;

import com.example.Library.Management.ITITIU22124.model.BorrowRecord;
import com.example.Library.Management.ITITIU22124.model.Reservation;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.repository.BorrowRepository;
import com.example.Library.Management.ITITIU22124.repository.ReservationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Value("${library.email.due-reminder-days:2}")
    private int dueReminderDays;

    @Value("${library.email.due-reminder-enabled:true}")
    private boolean dueReminderEnabled;

    @Value("${library.email.overdue-alert-enabled:true}")
    private boolean overdueAlertEnabled;

    @Value("${library.email.reservation-ready-enabled:true}")
    private boolean reservationReadyEnabled;

    /**
     * Scheduled task to send due date reminders
     * Runs every day at 9:00 AM
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDueDateReminders() {
        if (!dueReminderEnabled) {
            log.debug("Due date reminders are disabled");
            return;
        }

        log.info("Running scheduled due date reminder check...");

        LocalDate today = LocalDate.now();
        LocalDate reminderDate = today.plusDays(dueReminderDays);

        // Find all books due on the reminder date
        List<BorrowRecord> recordsDueSoon = borrowRepository.findAll().stream()
                .filter(record -> record.getReturnDate() == null)
                .filter(record -> {
                    long daysUntilDue = ChronoUnit.DAYS.between(today, record.getDueDate());
                    return daysUntilDue > 0 && daysUntilDue <= dueReminderDays;
                })
                .toList();

        log.info("Found {} books due within {} days", recordsDueSoon.size(), dueReminderDays);

        for (BorrowRecord record : recordsDueSoon) {
            try {
                User user = record.getUser();
                long daysUntilDue = ChronoUnit.DAYS.between(today, record.getDueDate());

                emailService.sendDueDateReminder(
                        user.getEmail(),
                        user.getName(),
                        record.getBook().getTitle(),
                        record.getBook().getAuthor(),
                        record.getDueDate(),
                        daysUntilDue);

                log.debug("Sent due date reminder to {} for book '{}'",
                        user.getEmail(), record.getBook().getTitle());

            } catch (Exception e) {
                log.error("Failed to send due date reminder for record {}: {}",
                        record.getId(), e.getMessage());
            }
        }
    }

    /**
     * Scheduled task to send overdue alerts
     * Runs every day at 10:00 AM
     */
    @Scheduled(cron = "0 0 10 * * ?")
    public void sendOverdueAlerts() {
        if (!overdueAlertEnabled) {
            log.debug("Overdue alerts are disabled");
            return;
        }

        log.info("Running scheduled overdue alert check...");

        LocalDate today = LocalDate.now();

        // Find all overdue books
        List<BorrowRecord> overdueRecords = borrowRepository
                .findByDueDateBeforeAndReturnDateIsNull(today);

        log.info("Found {} overdue books", overdueRecords.size());

        for (BorrowRecord record : overdueRecords) {
            try {
                User user = record.getUser();
                long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), today);

                emailService.sendOverdueAlert(
                        user.getEmail(),
                        user.getName(),
                        record.getBook().getTitle(),
                        record.getBook().getAuthor(),
                        record.getDueDate(),
                        daysOverdue);

                log.debug("Sent overdue alert to {} for book '{}' ({} days overdue)",
                        user.getEmail(), record.getBook().getTitle(), daysOverdue);

            } catch (Exception e) {
                log.error("Failed to send overdue alert for record {}: {}",
                        record.getId(), e.getMessage());
            }
        }
    }

    /**
     * Send notification when a reservation becomes ready
     * Called from ReservationService when a book becomes available
     */
    public void notifyReservationReady(Reservation reservation) {
        if (!reservationReadyEnabled) {
            log.debug("Reservation ready notifications are disabled");
            return;
        }

        try {
            User user = reservation.getUser();
            // Give user 3 days to pick up the book
            LocalDate expiryDate = LocalDate.now().plusDays(3);

            emailService.sendReservationReady(
                    user.getEmail(),
                    user.getName(),
                    reservation.getBook().getTitle(),
                    reservation.getBook().getAuthor(),
                    expiryDate);

            log.info("Sent reservation ready notification to {} for book '{}'",
                    user.getEmail(), reservation.getBook().getTitle());

        } catch (Exception e) {
            log.error("Failed to send reservation ready notification for reservation {}: {}",
                    reservation.getId(), e.getMessage());
        }
    }

    /**
     * Send notification when a book is borrowed
     * Called from BorrowService
     */
    public void notifyBookBorrowed(BorrowRecord borrowRecord) {
        try {
            User user = borrowRecord.getUser();

            emailService.sendBorrowConfirmation(
                    user.getEmail(),
                    user.getName(),
                    borrowRecord.getBook().getTitle(),
                    borrowRecord.getBook().getAuthor(),
                    borrowRecord.getBorrowDate(),
                    borrowRecord.getDueDate());

            log.info("Sent borrow confirmation to {} for book '{}'",
                    user.getEmail(), borrowRecord.getBook().getTitle());

        } catch (Exception e) {
            log.error("Failed to send borrow confirmation for record {}: {}",
                    borrowRecord.getId(), e.getMessage());
        }
    }

    /**
     * Send notification when a book is returned
     * Called from BorrowService
     */
    public void notifyBookReturned(BorrowRecord borrowRecord, boolean hadFine, String fineAmount) {
        try {
            User user = borrowRecord.getUser();

            emailService.sendReturnConfirmation(
                    user.getEmail(),
                    user.getName(),
                    borrowRecord.getBook().getTitle(),
                    borrowRecord.getBook().getAuthor(),
                    hadFine,
                    fineAmount);

            log.info("Sent return confirmation to {} for book '{}'",
                    user.getEmail(), borrowRecord.getBook().getTitle());

        } catch (Exception e) {
            log.error("Failed to send return confirmation for record {}: {}",
                    borrowRecord.getId(), e.getMessage());
        }
    }

    /**
     * Manually trigger due date reminders (for testing or admin use)
     */
    public int triggerDueReminders() {
        if (!dueReminderEnabled) {
            return 0;
        }

        LocalDate today = LocalDate.now();

        List<BorrowRecord> recordsDueSoon = borrowRepository.findAll().stream()
                .filter(record -> record.getReturnDate() == null)
                .filter(record -> {
                    long daysUntilDue = ChronoUnit.DAYS.between(today, record.getDueDate());
                    return daysUntilDue > 0 && daysUntilDue <= dueReminderDays;
                })
                .toList();

        for (BorrowRecord record : recordsDueSoon) {
            User user = record.getUser();
            long daysUntilDue = ChronoUnit.DAYS.between(today, record.getDueDate());

            emailService.sendDueDateReminder(
                    user.getEmail(),
                    user.getName(),
                    record.getBook().getTitle(),
                    record.getBook().getAuthor(),
                    record.getDueDate(),
                    daysUntilDue);
        }

        return recordsDueSoon.size();
    }

    /**
     * Manually trigger overdue alerts (for testing or admin use)
     */
    public int triggerOverdueAlerts() {
        if (!overdueAlertEnabled) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        List<BorrowRecord> overdueRecords = borrowRepository
                .findByDueDateBeforeAndReturnDateIsNull(today);

        for (BorrowRecord record : overdueRecords) {
            User user = record.getUser();
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), today);

            emailService.sendOverdueAlert(
                    user.getEmail(),
                    user.getName(),
                    record.getBook().getTitle(),
                    record.getBook().getAuthor(),
                    record.getDueDate(),
                    daysOverdue);
        }

        return overdueRecords.size();
    }
}
