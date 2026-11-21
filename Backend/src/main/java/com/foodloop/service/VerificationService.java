package com.foodloop.service;

import com.foodloop.entity.User;
import com.foodloop.entity.VerificationToken;
import com.foodloop.exception.ApiException;
import com.foodloop.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationService {

    private final VerificationTokenRepository tokenRepo;
    private final EmailService emailService;
    private final long tokenExpiryHours;
    private final long resendCooldownSeconds;

    public VerificationService(
            VerificationTokenRepository tokenRepo,
            EmailService emailService,
            @Value("${foodloop.verification.token-expiry-hours}") long tokenExpiryHours,
            @Value("${foodloop.verification.resend-cooldown-seconds}") long resendCooldownSeconds) {

        this.tokenRepo = tokenRepo;
        this.emailService = emailService;
        this.tokenExpiryHours = tokenExpiryHours;
        this.resendCooldownSeconds = resendCooldownSeconds;
    }

    /** Create a new verification token and send the email. */
    @Transactional
    public void createAndSend(User user) {
        String tokenValue = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(Duration.ofHours(tokenExpiryHours));

        VerificationToken token = new VerificationToken(tokenValue, user, expiresAt);
        tokenRepo.save(token);

        emailService.sendVerificationEmail(user.getEmail(), user.getName(), tokenValue);
    }

    /** Verify the token: mark it used, return the associated user. */
    @Transactional
    public User verify(String tokenValue) {
        VerificationToken token = tokenRepo.findByToken(tokenValue)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST,
                        "Invalid verification link. Please request a new one."));

        if (token.isUsed()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "This verification link has already been used.");
        }

        if (token.isExpired()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "This verification link has expired. Please request a new one.");
        }

        token.setUsed(true);
        tokenRepo.save(token);

        User user = token.getUser();
        user.setVerified(true);
        return user;
    }

    /** Resend verification email with cooldown check. */
    @Transactional
    public void resend(User user) {
        if (user.isVerified()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is already verified.");
        }

        // Cooldown: check last token creation time
        Optional<VerificationToken> lastToken =
                tokenRepo.findTopByUserIdOrderByCreatedAtDesc(user.getId());

        if (lastToken.isPresent()) {
            Instant cooldownEnd = lastToken.get().getCreatedAt()
                    .plus(Duration.ofSeconds(resendCooldownSeconds));
            if (Instant.now().isBefore(cooldownEnd)) {
                long secondsLeft = Duration.between(Instant.now(), cooldownEnd).getSeconds();
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                        "Please wait " + secondsLeft + " seconds before requesting another email.");
            }
        }

        createAndSend(user);
    }
}
