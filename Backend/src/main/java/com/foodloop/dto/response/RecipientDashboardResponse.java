package com.foodloop.dto.response;

import java.util.List;

/**
 * Recipient dashboard summary returned by GET /api/recipient/dashboard.
 */
public class RecipientDashboardResponse {

    private long totalClaims;
    private long pendingClaims;
    private long acceptedClaims;
    private long pickedUpClaims;
    private List<ClaimResponse> claims;

    public RecipientDashboardResponse() {}

    public long getTotalClaims()     { return totalClaims; }
    public long getPendingClaims()   { return pendingClaims; }
    public long getAcceptedClaims()  { return acceptedClaims; }
    public long getPickedUpClaims()  { return pickedUpClaims; }
    public List<ClaimResponse> getClaims() { return claims; }

    public void setTotalClaims(long v)     { this.totalClaims = v; }
    public void setPendingClaims(long v)   { this.pendingClaims = v; }
    public void setAcceptedClaims(long v)  { this.acceptedClaims = v; }
    public void setPickedUpClaims(long v)  { this.pickedUpClaims = v; }
    public void setClaims(List<ClaimResponse> v) { this.claims = v; }
}
