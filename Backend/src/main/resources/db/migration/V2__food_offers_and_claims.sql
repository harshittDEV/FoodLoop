-- ============================================================
-- FoodLoop — V2 Food Offers + Claims (Phase 2)
-- ============================================================

CREATE TABLE food_offers (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    donor_id            BIGINT          NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT            NOT NULL,
    category            VARCHAR(100)    NOT NULL,
    quantity            VARCHAR(100)    NOT NULL,
    is_free             BOOLEAN         NOT NULL DEFAULT TRUE,
    price               DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    prepared_at         TIMESTAMP       NULL,
    best_before         TIMESTAMP       NOT NULL,
    pickup_start        TIMESTAMP       NOT NULL,
    pickup_end          TIMESTAMP       NOT NULL,
    pickup_address      VARCHAR(500)    NOT NULL,
    pickup_instructions TEXT            NULL,
    lat                 DOUBLE          NULL,
    lng                 DOUBLE          NULL,
    dietary_tags        JSON            NULL,
    allergens           JSON            NULL,
    status              ENUM('AVAILABLE','RESERVED','PICKED_UP','EXPIRED','CANCELLED') NOT NULL DEFAULT 'AVAILABLE',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_offer_donor FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_offer_status (status),
    INDEX idx_offer_donor (donor_id),
    INDEX idx_offer_best_before (best_before),
    INDEX idx_offer_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE claims (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    offer_id            BIGINT          NOT NULL,
    claimer_id          BIGINT          NOT NULL,
    status              ENUM('PENDING','ACCEPTED','REJECTED','PICKED_UP','CANCELLED') NOT NULL DEFAULT 'PENDING',
    notes               TEXT            NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_claim_offer FOREIGN KEY (offer_id) REFERENCES food_offers(id) ON DELETE CASCADE,
    CONSTRAINT fk_claim_user  FOREIGN KEY (claimer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_claim_offer (offer_id),
    INDEX idx_claim_claimer (claimer_id),
    INDEX idx_claim_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
