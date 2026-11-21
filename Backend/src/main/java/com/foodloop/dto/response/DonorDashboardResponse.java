package com.foodloop.dto.response;

import java.util.List;

/**
 * Donor dashboard summary returned by GET /api/donor/dashboard.
 */
public class DonorDashboardResponse {

    private long totalOffers;
    private long activeOffers;
    private long reservedOffers;
    private long pickedUpOffers;
    private long cancelledOffers;
    private List<FoodOfferResponse> offers;
    private List<ClaimResponse> incomingClaims;

    public DonorDashboardResponse() {}

    public long getTotalOffers()     { return totalOffers; }
    public long getActiveOffers()    { return activeOffers; }
    public long getReservedOffers()  { return reservedOffers; }
    public long getPickedUpOffers()  { return pickedUpOffers; }
    public long getCancelledOffers() { return cancelledOffers; }
    public List<FoodOfferResponse> getOffers() { return offers; }
    public List<ClaimResponse> getIncomingClaims() { return incomingClaims; }

    public void setTotalOffers(long v)     { this.totalOffers = v; }
    public void setActiveOffers(long v)    { this.activeOffers = v; }
    public void setReservedOffers(long v)  { this.reservedOffers = v; }
    public void setPickedUpOffers(long v)  { this.pickedUpOffers = v; }
    public void setCancelledOffers(long v) { this.cancelledOffers = v; }
    public void setOffers(List<FoodOfferResponse> v) { this.offers = v; }
    public void setIncomingClaims(List<ClaimResponse> v) { this.incomingClaims = v; }
}
