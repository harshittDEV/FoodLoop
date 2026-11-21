package com.foodloop.repository;

import com.foodloop.entity.Claim;
import com.foodloop.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByOfferIdOrderByCreatedAtDesc(Long offerId);

    List<Claim> findByClaimerIdOrderByCreatedAtDesc(Long claimerId);

    Optional<Claim> findByOfferIdAndClaimerId(Long offerId, Long claimerId);

    boolean existsByOfferIdAndClaimerIdAndStatusIn(Long offerId, Long claimerId, List<ClaimStatus> statuses);

    long countByClaimerIdAndStatus(Long claimerId, ClaimStatus status);
}
