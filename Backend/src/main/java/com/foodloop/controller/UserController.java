package com.foodloop.controller;

import com.foodloop.dto.response.DonorDashboardResponse;
import com.foodloop.dto.response.RecipientDashboardResponse;
import com.foodloop.dto.response.UserResponse;
import com.foodloop.security.CustomUserDetails;
import com.foodloop.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private final DashboardService dashboardService;

    public UserController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /** GET /api/users/me — return the currently authenticated user. */
    @GetMapping("/users/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(UserResponse.from(userDetails.getUser()));
    }

    /** GET /api/donor/dashboard — donor's offers, incoming claims, and stats. */
    @GetMapping("/donor/dashboard")
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<DonorDashboardResponse> donorDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getDonorDashboard(userDetails.getUser()));
    }

    /** GET /api/recipient/dashboard — recipient's claims, pickup details, and stats. */
    @GetMapping("/recipient/dashboard")
    @PreAuthorize("hasAnyRole('NGO', 'INDIVIDUAL_RECIPIENT')")
    public ResponseEntity<RecipientDashboardResponse> recipientDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getRecipientDashboard(userDetails.getUser()));
    }
}
