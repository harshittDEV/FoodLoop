package com.foodloop.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateClaimRequest {

    @NotNull(message = "Offer ID is required")
    private Long offerId;

    @Size(max = 2000, message = "Notes must be under 2000 characters")
    private String notes;

    public CreateClaimRequest() {}

    public Long getOfferId()   { return offerId; }
    public String getNotes()   { return notes; }

    public void setOfferId(Long offerId) { this.offerId = offerId; }
    public void setNotes(String notes)   { this.notes = notes; }
}
