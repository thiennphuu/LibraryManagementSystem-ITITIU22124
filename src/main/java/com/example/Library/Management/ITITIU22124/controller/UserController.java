package com.example.Library.Management.ITITIU22124.controller;

import com.example.Library.Management.ITITIU22124.dto.UserProfileDTO;
import com.example.Library.Management.ITITIU22124.model.User;
import com.example.Library.Management.ITITIU22124.repository.BorrowRepository;
import com.example.Library.Management.ITITIU22124.repository.ReservationRepository;
import com.example.Library.Management.ITITIU22124.service.FineService;
import com.example.Library.Management.ITITIU22124.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BorrowRepository borrowRepository;

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
}
