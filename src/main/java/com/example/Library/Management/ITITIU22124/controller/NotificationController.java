package com.example.Library.Management.ITITIU22124.controller;

import com.example.Library.Management.ITITIU22124.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Manually trigger due date reminder emails (Admin only)
     */
    @PostMapping("/trigger/due-reminders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> triggerDueReminders() {
        int count = notificationService.triggerDueReminders();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Due date reminders triggered");
        response.put("emailsSent", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Manually trigger overdue alert emails (Admin only)
     */
    @PostMapping("/trigger/overdue-alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> triggerOverdueAlerts() {
        int count = notificationService.triggerOverdueAlerts();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Overdue alerts triggered");
        response.put("emailsSent", count);

        return ResponseEntity.ok(response);
    }

    /**
     * Trigger all scheduled notifications (Admin only)
     */
    @PostMapping("/trigger/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> triggerAllNotifications() {
        int dueReminders = notificationService.triggerDueReminders();
        int overdueAlerts = notificationService.triggerOverdueAlerts();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All notifications triggered");
        response.put("dueRemindersSent", dueReminders);
        response.put("overdueAlertsSent", overdueAlerts);
        response.put("totalEmailsSent", dueReminders + overdueAlerts);

        return ResponseEntity.ok(response);
    }

    /**
     * Get notification settings/status (Admin only)
     */
    @GetMapping("/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getNotificationSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("dueReminderEnabled", true);
        settings.put("overdueAlertEnabled", true);
        settings.put("reservationReadyEnabled", true);
        settings.put("scheduledDueReminder", "Daily at 9:00 AM");
        settings.put("scheduledOverdueAlert", "Daily at 10:00 AM");

        return ResponseEntity.ok(settings);
    }
}
