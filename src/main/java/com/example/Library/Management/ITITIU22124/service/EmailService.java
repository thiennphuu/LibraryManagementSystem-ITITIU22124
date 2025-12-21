package com.example.Library.Management.ITITIU22124.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${library.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${library.email.from-name:Library Management System}")
    private String fromName;

    @Value("${library.email.from-address:noreply@library.com}")
    private String fromAddress;

    /**
     * Send an HTML email using a Thymeleaf template
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled. Would have sent '{}' to {}", subject, to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Process template
            Context context = new Context();
            context.setVariables(variables);
            String htmlContent = templateEngine.process(templateName, context);

            helper.setFrom(fromAddress, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to {} with subject: {}", to, subject);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Send due date reminder email
     */
    public void sendDueDateReminder(String toEmail, String userName, String bookTitle,
            String bookAuthor, LocalDate dueDate, long daysUntilDue) {
        Map<String, Object> variables = Map.of(
                "userName", userName,
                "bookTitle", bookTitle,
                "bookAuthor", bookAuthor,
                "dueDate", dueDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
                "daysUntilDue", daysUntilDue);

        String subject = "📚 Reminder: \"" + bookTitle + "\" is due in " + daysUntilDue + " day(s)";
        sendHtmlEmail(toEmail, subject, "email/due-reminder", variables);
    }

    /**
     * Send overdue alert email
     */
    public void sendOverdueAlert(String toEmail, String userName, String bookTitle,
            String bookAuthor, LocalDate dueDate, long daysOverdue) {
        Map<String, Object> variables = Map.of(
                "userName", userName,
                "bookTitle", bookTitle,
                "bookAuthor", bookAuthor,
                "dueDate", dueDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
                "daysOverdue", daysOverdue);

        String subject = "⚠️ OVERDUE: \"" + bookTitle + "\" is " + daysOverdue + " day(s) overdue";
        sendHtmlEmail(toEmail, subject, "email/overdue-alert", variables);
    }

    /**
     * Send reservation ready notification
     */
    public void sendReservationReady(String toEmail, String userName, String bookTitle,
            String bookAuthor, LocalDate expiryDate) {
        Map<String, Object> variables = Map.of(
                "userName", userName,
                "bookTitle", bookTitle,
                "bookAuthor", bookAuthor,
                "expiryDate", expiryDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")));

        String subject = "🎉 Good news! \"" + bookTitle + "\" is ready for pickup";
        sendHtmlEmail(toEmail, subject, "email/reservation-ready", variables);
    }

    /**
     * Send book borrowed confirmation
     */
    public void sendBorrowConfirmation(String toEmail, String userName, String bookTitle,
            String bookAuthor, LocalDate borrowDate, LocalDate dueDate) {
        Map<String, Object> variables = Map.of(
                "userName", userName,
                "bookTitle", bookTitle,
                "bookAuthor", bookAuthor,
                "borrowDate", borrowDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")),
                "dueDate", dueDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy")));

        String subject = "📖 Book borrowed: \"" + bookTitle + "\"";
        sendHtmlEmail(toEmail, subject, "email/borrow-confirmation", variables);
    }

    /**
     * Send book return confirmation
     */
    public void sendReturnConfirmation(String toEmail, String userName, String bookTitle,
            String bookAuthor, boolean hadFine, String fineAmount) {
        Map<String, Object> variables = Map.of(
                "userName", userName,
                "bookTitle", bookTitle,
                "bookAuthor", bookAuthor,
                "hadFine", hadFine,
                "fineAmount", fineAmount != null ? fineAmount : "0.00");

        String subject = hadFine
                ? "📕 Book returned with fine: \"" + bookTitle + "\""
                : "📕 Book returned: \"" + bookTitle + "\"";
        sendHtmlEmail(toEmail, subject, "email/return-confirmation", variables);
    }
}
