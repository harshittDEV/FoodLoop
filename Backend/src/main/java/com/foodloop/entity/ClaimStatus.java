package com.foodloop.entity;

/**
 * Status lifecycle for a claim.
 *
 * PENDING   → ACCEPTED  (donor approves)
 * PENDING   → REJECTED  (donor declines)
 * PENDING   → CANCELLED (claimer withdraws)
 * ACCEPTED  → PICKED_UP (donor marks pickup complete)
 * ACCEPTED  → CANCELLED (claimer withdraws)
 */
public enum ClaimStatus {
    PENDING("pending"),
    ACCEPTED("accepted"),
    REJECTED("rejected"),
    PICKED_UP("picked_up"),
    CANCELLED("cancelled");

    private final String frontendValue;

    ClaimStatus(String frontendValue) {
        this.frontendValue = frontendValue;
    }

    public String getFrontendValue() {
        return frontendValue;
    }

    public static ClaimStatus fromFrontendValue(String value) {
        for (ClaimStatus s : values()) {
            if (s.frontendValue.equals(value)) return s;
        }
        throw new IllegalArgumentException("Unknown claim status: " + value);
    }
}
