package com.foodloop.controller;

import com.foodloop.dto.request.CreateOfferRequest;
import com.foodloop.dto.request.UpdateOfferRequest;
import com.foodloop.dto.response.FoodOfferResponse;
import com.foodloop.dto.response.PageResponse;
import com.foodloop.security.CustomUserDetails;
import com.foodloop.service.FoodOfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offers")
public class FoodOfferController {

    private final FoodOfferService offerService;

    public FoodOfferController(FoodOfferService offerService) {
        this.offerService = offerService;
    }

    /** POST /api/offers — Create a new food offer (donors only). */
    @PostMapping
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<FoodOfferResponse> create(
            @Valid @RequestBody CreateOfferRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FoodOfferResponse response = offerService.create(request, userDetails.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** PUT /api/offers/{id} — Update an offer (owner only). */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<FoodOfferResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOfferRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        FoodOfferResponse response = offerService.update(id, request, userDetails.getUser());
        return ResponseEntity.ok(response);
    }

    /** DELETE /api/offers/{id} — Cancel an offer (owner only). */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INDIVIDUAL_DONOR', 'RESTAURANT_DONOR')")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        offerService.cancel(id, userDetails.getUser());
        return ResponseEntity.noContent().build();
    }

    /** GET /api/offers/{id} — Get offer details (public). */
    @GetMapping("/{id}")
    public ResponseEntity<FoodOfferResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getById(id));
    }

    /**
     * GET /api/offers — Browse available offers with filters and pagination.
     * Public endpoint — no auth required.
     */
    @GetMapping
    public ResponseEntity<PageResponse<FoodOfferResponse>> browse(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "all") String donorType,
            @RequestParam(required = false, defaultValue = "all") String priceType,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "12") int size) {
        return ResponseEntity.ok(offerService.browse(search, category, donorType, priceType, page, size));
    }
}
