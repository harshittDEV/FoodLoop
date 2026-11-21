package com.foodloop.service;

import com.foodloop.dto.request.CreateClaimRequest;
import com.foodloop.dto.response.ClaimResponse;
import com.foodloop.entity.*;
import com.foodloop.exception.ApiException;
import com.foodloop.repository.ClaimRepository;
import com.foodloop.repository.FoodOfferRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepo;
    private final FoodOfferRepository offerRepo;

    public ClaimService(ClaimRepository claimRepo, FoodOfferRepository offerRepo) {
        this.claimRepo = claimRepo;
        this.offerRepo = offerRepo;
    }

    /**
     * A recipient claims an available offer.
     * Uses @Transactional to prevent double-claiming race conditions.
     */
    @Transactional
    public ClaimResponse create(CreateClaimRequest req, User claimer) {
        validateRecipientRole(claimer);

        FoodOffer offer = offerRepo.findById(req.getOfferId())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Food offer not found."));

        if (offer.getStatus() != OfferStatus.AVAILABLE) {
            throw new ApiException(HttpStatus.CONFLICT,
                "This offer is no longer available for claiming.");
        }

        if (offer.getDonor().getId().equals(claimer.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "You cannot claim your own offer.");
        }

        // Prevent duplicate active claims by same user
        boolean alreadyClaimed = claimRepo.existsByOfferIdAndClaimerIdAndStatusIn(
            offer.getId(), claimer.getId(),
            List.of(ClaimStatus.PENDING, ClaimStatus.ACCEPTED));
        if (alreadyClaimed) {
            throw new ApiException(HttpStatus.CONFLICT,
                "You already have an active claim on this offer.");
        }

        Claim claim = new Claim();
        claim.setOffer(offer);
        claim.setClaimer(claimer);
        claim.setNotes(req.getNotes());

        // Mark offer as reserved
        offer.setStatus(OfferStatus.RESERVED);
        offerRepo.save(offer);

        claim = claimRepo.save(claim);
        return ClaimResponse.from(claim);
    }

    /** Donor accepts a pending claim. */
    @Transactional
    public ClaimResponse accept(Long claimId, User donor) {
        Claim claim = getClaimForDonor(claimId, donor);
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Only pending claims can be accepted.");
        }
        claim.setStatus(ClaimStatus.ACCEPTED);
        claim = claimRepo.save(claim);
        return ClaimResponse.from(claim);
    }

    /** Donor rejects a pending claim — re-opens the offer if no other active claims. */
    @Transactional
    public ClaimResponse reject(Long claimId, User donor) {
        Claim claim = getClaimForDonor(claimId, donor);
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Only pending claims can be rejected.");
        }
        claim.setStatus(ClaimStatus.REJECTED);
        claimRepo.save(claim);

        reopenOfferIfNeeded(claim.getOffer());

        return ClaimResponse.from(claim);
    }

    /** Donor marks pickup complete. */
    @Transactional
    public ClaimResponse markPickedUp(Long claimId, User donor) {
        Claim claim = getClaimForDonor(claimId, donor);
        if (claim.getStatus() != ClaimStatus.ACCEPTED) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Only accepted claims can be marked as picked up.");
        }
        claim.setStatus(ClaimStatus.PICKED_UP);
        claimRepo.save(claim);

        FoodOffer offer = claim.getOffer();
        offer.setStatus(OfferStatus.PICKED_UP);
        offerRepo.save(offer);

        return ClaimResponse.from(claim);
    }

    /** Recipient cancels their own claim. */
    @Transactional
    public ClaimResponse cancel(Long claimId, User claimer) {
        Claim claim = claimRepo.findById(claimId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Claim not found."));

        if (!claim.getClaimer().getId().equals(claimer.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "You can only cancel your own claims.");
        }
        if (claim.getStatus() == ClaimStatus.PICKED_UP) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Cannot cancel a claim that has already been picked up.");
        }
        if (claim.getStatus() == ClaimStatus.CANCELLED) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "This claim is already cancelled.");
        }

        claim.setStatus(ClaimStatus.CANCELLED);
        claimRepo.save(claim);

        reopenOfferIfNeeded(claim.getOffer());

        return ClaimResponse.from(claim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getClaimsForOffer(Long offerId) {
        return claimRepo.findByOfferIdOrderByCreatedAtDesc(offerId).stream()
            .map(ClaimResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getClaimsByUser(Long userId) {
        return claimRepo.findByClaimerIdOrderByCreatedAtDesc(userId).stream()
            .map(ClaimResponse::from)
            .toList();
    }

    long countByClaimerAndStatus(Long claimerId, ClaimStatus status) {
        return claimRepo.countByClaimerIdAndStatus(claimerId, status);
    }

    // ── Helpers ────────────────────────────────────

    private Claim getClaimForDonor(Long claimId, User donor) {
        Claim claim = claimRepo.findById(claimId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Claim not found."));
        if (!claim.getOffer().getDonor().getId().equals(donor.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "You can only manage claims on your own offers.");
        }
        return claim;
    }

    private void reopenOfferIfNeeded(FoodOffer offer) {
        boolean hasActiveClaims = claimRepo.findByOfferIdOrderByCreatedAtDesc(offer.getId())
            .stream()
            .anyMatch(c -> c.getStatus() == ClaimStatus.PENDING || c.getStatus() == ClaimStatus.ACCEPTED);
        if (!hasActiveClaims && offer.getStatus() == OfferStatus.RESERVED) {
            offer.setStatus(OfferStatus.AVAILABLE);
            offerRepo.save(offer);
        }
    }

    private void validateRecipientRole(User user) {
        if (user.getRole() != Role.NGO && user.getRole() != Role.INDIVIDUAL_RECIPIENT) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "Only food seekers and NGOs can claim food.");
        }
        if (!user.isVerified()) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "Please verify your email before claiming food.");
        }
    }
}
