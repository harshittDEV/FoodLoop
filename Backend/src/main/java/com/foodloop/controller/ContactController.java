package com.foodloop.controller;

import com.foodloop.dto.request.ContactRequest;
import com.foodloop.exception.ApiException;
import com.foodloop.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final EmailService emailService;

    // Rate limiter: IP address -> list of submission timestamps (max 5 per 10 minutes)
    private final ConcurrentHashMap<String, RateLimitTracker> rateLimiter = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_WINDOW = 5;
    private static final long WINDOW_SECONDS = 600; // 10 minutes

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContact(
            @Valid @RequestBody ContactRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = getClientIp(httpRequest);
        checkRateLimit(clientIp);

        emailService.sendContactEmail(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thank you! Your message has been sent to our team at " + request.getEmail() + "."
        ));
    }

    private void checkRateLimit(String clientIp) {
        Instant now = Instant.now();
        RateLimitTracker tracker = rateLimiter.computeIfAbsent(clientIp, k -> new RateLimitTracker());

        synchronized (tracker) {
            tracker.cleanOld(now.minusSeconds(WINDOW_SECONDS));
            if (tracker.getCount() >= MAX_REQUESTS_PER_WINDOW) {
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                        "You have sent several messages recently. Please wait a few minutes before submitting another.");
            }
            tracker.add(now);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }

    private static class RateLimitTracker {
        private final java.util.List<Instant> timestamps = new java.util.ArrayList<>();

        public synchronized void cleanOld(Instant cutoff) {
            timestamps.removeIf(t -> t.isBefore(cutoff));
        }

        public synchronized int getCount() {
            return timestamps.size();
        }

        public synchronized void add(Instant timestamp) {
            timestamps.add(timestamp);
        }
    }
}
