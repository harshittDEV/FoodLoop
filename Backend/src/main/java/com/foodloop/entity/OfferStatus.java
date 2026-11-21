package com.foodloop.entity;

/**
 * Status lifecycle for a food offer.
 *
 * AVAILABLE → RESERVED  (when a claim is created)
 * AVAILABLE → EXPIRED   (past best-before / pickup window)
 * AVAILABLE → CANCELLED (donor withdraws)
 * RESERVED  → PICKED_UP (donor marks pickup complete)
 * RESERVED  → AVAILABLE (if claim is cancelled/rejected — re-opens)
 * RESERVED  → CANCELLED (donor withdraws)
 */
public enum OfferStatus {
    AVAILABLE("available"),
    RESERVED("reserved"),
    PICKED_UP("picked_up"),
    EXPIRED("expired"),
    CANCELLED("cancelled");

    private final String frontendValue;

    OfferStatus(String frontendValue) {
        this.frontendValue = frontendValue;
    }

    public String getFrontendValue() {
        return frontendValue;
    }

    public static OfferStatus fromFrontendValue(String value) {
        for (OfferStatus s : values()) {
            if (s.frontendValue.equals(value)) return s;
        }
        throw new IllegalArgumentException("Unknown offer status: " + value);
    }
}
