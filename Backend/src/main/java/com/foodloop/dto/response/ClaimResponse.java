package com.foodloop.dto.response;

import com.foodloop.entity.Claim;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * Public representation of a claim.
 * Includes embedded offer summary for the recipient dashboard.
 */
public class ClaimResponse {

    private Long id;
    private Long offerId;
    private String offerTitle;
    private Long claimerId;
    private String claimerName;
    private String status;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    // Offer summary fields for recipient dashboard
    private String donorName;
    private boolean offerIsFree;
    private BigDecimal offerPrice;
    private String pickupAddress;
    private Instant pickupStart;
    private Instant pickupEnd;
    private String pickupInstructions;

    public ClaimResponse() {}

    public static ClaimResponse from(Claim claim) {
        ClaimResponse r = new ClaimResponse();
        r.id = claim.getId();
        r.offerId = claim.getOffer().getId();
        r.offerTitle = claim.getOffer().getTitle();
        r.claimerId = claim.getClaimer().getId();
        r.claimerName = claim.getClaimer().getName();
        r.status = claim.getStatus().getFrontendValue();
        r.notes = claim.getNotes();
        r.createdAt = claim.getCreatedAt();
        r.updatedAt = claim.getUpdatedAt();

        r.donorName = claim.getOffer().getDonor().getName();
        r.offerIsFree = claim.getOffer().isFree();
        r.offerPrice = claim.getOffer().getPrice();
        r.pickupAddress = claim.getOffer().getPickupAddress();
        r.pickupStart = claim.getOffer().getPickupStart();
        r.pickupEnd = claim.getOffer().getPickupEnd();
        r.pickupInstructions = claim.getOffer().getPickupInstructions();
        return r;
    }

    public Long getId()            { return id; }
    public Long getOfferId()       { return offerId; }
    public String getOfferTitle()  { return offerTitle; }
    public Long getClaimerId()     { return claimerId; }
    public String getClaimerName() { return claimerName; }
    public String getStatus()      { return status; }
    public String getNotes()       { return notes; }
    public Instant getCreatedAt()  { return createdAt; }
    public Instant getUpdatedAt()  { return updatedAt; }
    public String getDonorName()   { return donorName; }
    public boolean isOfferIsFree() { return offerIsFree; }
    public BigDecimal getOfferPrice() { return offerPrice; }
    public String getPickupAddress()      { return pickupAddress; }
    public Instant getPickupStart()       { return pickupStart; }
    public Instant getPickupEnd()         { return pickupEnd; }
    public String getPickupInstructions() { return pickupInstructions; }
}
