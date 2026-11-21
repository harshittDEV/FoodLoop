package com.foodloop.service;

import com.foodloop.dto.request.SignInRequest;
import com.foodloop.dto.request.SignUpRequest;
import com.foodloop.dto.response.AuthResponse;
import com.foodloop.dto.response.UserResponse;
import com.foodloop.entity.Role;
import com.foodloop.entity.User;
import com.foodloop.exception.ApiException;
import com.foodloop.repository.UserRepository;
import com.foodloop.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final VerificationService verificationService;

    public AuthService(UserRepository userRepo,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       VerificationService verificationService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.verificationService = verificationService;
    }

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "An account with this email already exists.");
        }

        Role role = Role.fromFrontendValue(request.getRole());

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );
        user = userRepo.save(user);

        // Send verification email
        verificationService.createAndSend(user);

        return AuthResponse.signUpOk(UserResponse.from(user));
    }

    public AuthResponse signIn(SignInRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED,
                        "No account found with this email. Try signing up."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,
                    "Invalid email or password.");
        }

        if (!user.isVerified()) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "Please verify your email before signing in. Check your inbox for the verification link.");
        }

        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.ok(token, UserResponse.from(user));
    }
}
