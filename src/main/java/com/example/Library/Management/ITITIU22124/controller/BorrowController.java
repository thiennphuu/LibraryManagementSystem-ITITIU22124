
package com.example.Library.Management.ITITIU22124.controller;
// Get all borrows (Admin)

import com.example.Library.Management.ITITIU22124.dto.BorrowDTO;
import com.example.Library.Management.ITITIU22124.model.BorrowRecord;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping
    public ResponseEntity<BorrowRecord> borrowBook(@RequestBody Map<String, Long> borrowData) {
        Long userId = borrowData.get("userId");
        Long bookId = borrowData.get("bookId");
        return ResponseEntity.ok(borrowService.borrowBook(userId, bookId));
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<BorrowRecord> returnBookAlt(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @GetMapping("/user/{userId}")
    public List<BorrowRecord> getBorrowedBooksByUser(@PathVariable Long userId) {
        return borrowService.getBorrowedBooksByUser(userId);
    }

    @GetMapping("/my-books")
    public List<BorrowRecord> getMyBorrowedBooks(@AuthenticationPrincipal User user) {
        return borrowService.getBorrowedBooksByUser(user.getId());
    }

    @PutMapping("/{id}/extend")
    public ResponseEntity<BorrowRecord> extendBorrow(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.extendBorrow(id));
    }

    @GetMapping("/overdue")
    public List<BorrowRecord> getOverdueBooks() {
        return borrowService.getOverdueBooks();
    }

    @GetMapping
    public List<BorrowRecord> getAllBorrows() {
        return borrowService.getAllBorrows();
    }
}
