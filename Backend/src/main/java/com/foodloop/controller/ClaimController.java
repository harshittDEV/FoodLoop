package com.foodloop.controller;

import com.foodloop.dto.request.CreateClaimRequest;
import com.foodloop.dto.response.ClaimResponse;
import com.foodloop.security.CustomUserDetails;
import com.foodloop.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    /** POST /api/claims — Claim an offer (recipients only). */
    @PostMapping
    @PreAuthorize("hasAnyRole('NGO', 'INDIVIDUAL_RECIPIENT')")
    public ResponseEntity<ClaimResponse> create(
            @Valid @RequestBody CreateClaimRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ClaimResponse response = claimService.create(request, userDetails.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** POST /api/claims/{id}/accept — Donor accepts a claim. */
    @PostMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<ClaimResponse> accept(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(claimService.accept(id, userDetails.getUser()));
    }

    /** POST /api/claims/{id}/reject — Donor rejects a claim. */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<ClaimResponse> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(claimService.reject(id, userDetails.getUser()));
    }

    /** POST /api/claims/{id}/pickup — Donor marks pickup complete. */
    @PostMapping("/{id}/pickup")
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<ClaimResponse> markPickedUp(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(claimService.markPickedUp(id, userDetails.getUser()));
    }

    /** POST /api/claims/{id}/cancel — Recipient cancels their claim. */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('NGO', 'INDIVIDUAL_RECIPIENT')")
    public ResponseEntity<ClaimResponse> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(claimService.cancel(id, userDetails.getUser()));
    }

    /** GET /api/claims/offer/{offerId} — Get claims for an offer (authenticated). */
    @GetMapping("/offer/{offerId}")
    public ResponseEntity<List<ClaimResponse>> getClaimsForOffer(@PathVariable Long offerId) {
        return ResponseEntity.ok(claimService.getClaimsForOffer(offerId));
    }
}
