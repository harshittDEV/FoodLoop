package com.foodloop.entity;

/**
 * Maps 1-to-1 with the frontend ROLES constant values.
 *
 * Frontend value          → Enum name
 * "individual_donor"      → INDIVIDUAL_DONOR
 * "restaurant_donor"      → RESTAURANT_DONOR
 * "ngo"                   → NGO
 * "individual_recipient"  → INDIVIDUAL_RECIPIENT
 *
 * The JSON serialisation uses the lowercase frontend value
 * (see getter in User / DTOs) so the React frontend receives
 * exactly the string it expects.
 */
public enum Role {
    INDIVIDUAL_DONOR("individual_donor"),
    RESTAURANT_DONOR("restaurant_donor"),
    NGO("ngo"),
    INDIVIDUAL_RECIPIENT("individual_recipient");

    private final String frontendValue;

    Role(String frontendValue) {
        this.frontendValue = frontendValue;
    }

    /** The lowercase value the React frontend sends and expects. */
    public String getFrontendValue() {
        return frontendValue;
    }

    /** Parse the value received from the frontend. */
    public static Role fromFrontendValue(String value) {
        for (Role r : values()) {
            if (r.frontendValue.equals(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + value);
    }
}
