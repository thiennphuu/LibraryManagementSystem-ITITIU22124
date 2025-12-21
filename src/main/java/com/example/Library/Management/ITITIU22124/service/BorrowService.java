package com.example.Library.Management.ITITIU22124.service;

import com.example.Library.Management.ITITIU22124.exception.BadRequestException;
import com.example.Library.Management.ITITIU22124.exception.NotFoundException;
import com.example.Library.Management.ITITIU22124.model.BorrowRecord;
import com.example.Library.Management.ITITIU22124.model.BorrowStatus;
import com.example.Library.Management.ITITIU22124.model.Fine;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.repository.BookRepository;
import com.example.Library.Management.ITITIU22124.repository.BorrowRepository;
import com.example.Library.Management.ITITIU22124.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookService bookService; // Use Service for encapsulation of copy logic

    @Autowired
    private ReservationService reservationService;

    @Autowired
    @Lazy
    private FineService fineService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public BorrowRecord borrowBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        if (borrowRepository.existsByUserIdAndBookIdAndReturnDateIsNull(userId, bookId)) {
            throw new BadRequestException("User already has a copy of this book");
        }

        bookService.borrowCopy(bookId); // Will throw if no copies (except if we handle exceptions here)

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(bookRepository.findById(bookId).get()); // Re-fetch to be safe or just use ID
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusWeeks(2)); // Default 2 weeks loan
        record.setStatus(BorrowStatus.BORROWED);
        BorrowRecord savedRecord = borrowRepository.save(record);

        // Send borrow confirmation email (async, don't fail transaction on email error)
        try {
            notificationService.notifyBookBorrowed(savedRecord);
        } catch (Exception e) {
            System.err.println("Failed to send borrow notification: " + e.getMessage());
        }

        return savedRecord;
    }

    @Transactional
    public BorrowRecord returnBook(Long borrowId) {
        BorrowRecord record = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new NotFoundException("Borrow record not found with id: " + borrowId));

        if (record.getReturnDate() != null) {
            throw new BadRequestException("Book already returned");
        }

        LocalDate returnDate = LocalDate.now();
        record.setReturnDate(returnDate);
        record.setStatus(BorrowStatus.RETURNED);

        // Auto-calculate and create fine if overdue
        boolean hadFine = false;
        String fineAmount = null;
        if (returnDate.isAfter(record.getDueDate())) {
            Fine fine = fineService.calculateAndCreateFine(record, returnDate);
            if (fine != null) {
                hadFine = true;
                fineAmount = fine.getAmount().toString();
                System.out.println(
                        "Fine created: $" + fine.getAmount() + " for " + fine.getDaysOverdue() + " days overdue");
            }
        }

        bookService.returnCopy(record.getBook().getId());

        // Check for reservations
        reservationService.handleReturn(record.getBook().getId());

        BorrowRecord savedRecord = borrowRepository.save(record);

        // Send return confirmation email (async, don't fail transaction on email error)
        try {
            notificationService.notifyBookReturned(savedRecord, hadFine, fineAmount);
        } catch (Exception e) {
            System.err.println("Failed to send return notification: " + e.getMessage());
        }

        return savedRecord;
    }

    @Transactional
    public BorrowRecord extendBorrow(Long borrowId) {
        BorrowRecord record = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new NotFoundException("Borrow record not found with id: " + borrowId));

        if (record.getReturnDate() != null) {
            throw new BadRequestException("Cannot extend - book already returned");
        }

        if (record.getDueDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot extend - book is overdue. Please return it first.");
        }

        // Extend by 1 week
        record.setDueDate(record.getDueDate().plusWeeks(1));
        return borrowRepository.save(record);
    }

    public List<BorrowRecord> getBorrowedBooksByUser(Long userId) {
        return borrowRepository.findByUserId(userId);
    }

    public List<BorrowRecord> getOverdueBooks() {
        return borrowRepository.findByDueDateBeforeAndReturnDateIsNull(LocalDate.now());
    }
}
