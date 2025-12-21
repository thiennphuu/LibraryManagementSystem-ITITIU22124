package com.example.Library.Management.ITITIU22124.controller;

import com.example.Library.Management.ITITIU22124.dto.UserProfileDTO;
import com.example.Library.Management.ITITIU22124.dto.BookDTO;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.model.Book;
import com.example.Library.Management.ITITIU22124.model.BorrowRecord;
import com.example.Library.Management.ITITIU22124.service.UserService;
import com.example.Library.Management.ITITIU22124.repository.BorrowRepository;
import com.example.Library.Management.ITITIU22124.repository.BookRepository;
import com.example.Library.Management.ITITIU22124.repository.ReservationRepository;
import com.example.Library.Management.ITITIU22124.service.FineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FineService fineService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        UserProfileDTO profile = new UserProfileDTO(user);

        // Calculate statistics
        Long userId = user.getId();
        profile.setBorrowedCount(borrowRepository.countByUserId(userId));
        profile.setCurrentBorrows(borrowRepository.countByUserIdAndReturnDateIsNull(userId));
        profile.setOverdueCount(
                borrowRepository.countByUserIdAndDueDateBeforeAndReturnDateIsNull(userId, LocalDate.now()));
        profile.setReservationCount(
                reservationRepository.countByUserIdAndStatusIn(
                        userId,
                        Arrays.asList(
                                com.example.Library.Management.ITITIU22124.model.ReservationStatus.PENDING,
                                com.example.Library.Management.ITITIU22124.model.ReservationStatus.READY)));

        // Fine statistics
        profile.setUnpaidFinesCount(fineService.getUnpaidFinesCount(userId));
        profile.setTotalUnpaidFines(fineService.getTotalUnpaidAmount(userId));

        return ResponseEntity.ok(profile);
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        return userService.authenticate(username, password)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    @GetMapping
    public List<User> listUsers() {
        return userService.getAllUsers();
    }

    // New endpoint for book recommendations based on borrowing history
    @GetMapping("/{id}/recommendations")
    public List<BookDTO> getRecommendations(@PathVariable Long id) {
        // Get all books first (optimization: could be paginated in real app)
        List<Book> allBooks = bookRepository.findAll();
        Set<Long> borrowedBookIds = borrowRepository.findByUserId(id).stream()
                .map(b -> b.getBook().getId())
                .collect(Collectors.toSet());

        // 1. Try strategy: Most borrowed category
        List<BorrowRecord> borrows = borrowRepository.findByUserId(id);
        Map<String, Long> categoryCount = borrows.stream()
                .map(b -> b.getBook().getCategory())
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()));

        String topCategory = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        List<Book> recommendations = new ArrayList<>();

        if (topCategory != null) {
            List<Book> categoryBooks = allBooks.stream()
                    .filter(b -> Objects.equals(b.getCategory(), topCategory))
                    .filter(b -> !borrowedBookIds.contains(b.getId()))
                    .filter(b -> b.getCopiesAvailable() > 0)
                    .limit(5)
                    .collect(Collectors.toList());
            recommendations.addAll(categoryBooks);
        }

        // 2. Fallback strategy: If not enough recommendations, fill with any available
        // books
        if (recommendations.size() < 5) {
            List<Book> fillers = allBooks.stream()
                    .filter(b -> !borrowedBookIds.contains(b.getId()))
                    .filter(b -> !recommendations.contains(b)) // Avoid duplicates
                    .filter(b -> b.getCopiesAvailable() > 0)
                    .limit(5 - recommendations.size())
                    .collect(Collectors.toList());
            recommendations.addAll(fillers);
        }

        return recommendations.stream()
                .map(b -> new BookDTO(b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), b.getCategory(),
                        b.getPublishedYear(), b.getCopiesTotal(), b.getCopiesAvailable(), b.getCopiesAvailable() > 0))
                .collect(Collectors.toList());
    }
}
