package com.foodloop.controller;

import com.foodloop.dto.request.ResendVerificationRequest;
import com.foodloop.dto.request.SignInRequest;
import com.foodloop.dto.request.SignUpRequest;
import com.foodloop.dto.response.ApiErrorResponse;
import com.foodloop.dto.response.AuthResponse;
import com.foodloop.entity.User;
import com.foodloop.exception.ApiException;
import com.foodloop.repository.UserRepository;
import com.foodloop.service.AuthService;
import com.foodloop.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final VerificationService verificationService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService,
                          VerificationService verificationService,
                          UserRepository userRepository) {
        this.authService = authService;
        this.verificationService = verificationService;
        this.userRepository = userRepository;
    }

    /** POST /api/auth/signup */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** POST /api/auth/signin */
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody SignInRequest request) {
        AuthResponse response = authService.signIn(request);
        return ResponseEntity.ok(response);
    }

    /** GET /api/auth/verify-email?token=... */
    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestParam String token) {
        User user = verificationService.verify(token);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email verified successfully. You can now sign in."
        ));
    }

    /** POST /api/auth/resend-verification */
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Object>> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "No account found with this email."));

        verificationService.resend(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Verification email sent. Please check your inbox."
        ));
    }
}
