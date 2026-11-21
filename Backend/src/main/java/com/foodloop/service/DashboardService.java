package com.foodloop.service;

import com.foodloop.dto.response.*;
import com.foodloop.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final FoodOfferService offerService;
    private final ClaimService claimService;

    public DashboardService(FoodOfferService offerService, ClaimService claimService) {
        this.offerService = offerService;
        this.claimService = claimService;
    }

    @Transactional(readOnly = true)
    public DonorDashboardResponse getDonorDashboard(User donor) {
        List<FoodOfferResponse> offers = offerService.getByDonor(donor.getId());

        // Collect all incoming claims for this donor's offers
        List<ClaimResponse> allClaims = new ArrayList<>();
        for (FoodOfferResponse o : offers) {
            allClaims.addAll(claimService.getClaimsForOffer(o.getId()));
        }

        DonorDashboardResponse resp = new DonorDashboardResponse();
        resp.setTotalOffers(offers.size());
        resp.setActiveOffers(offerService.countByDonorAndStatus(donor.getId(), OfferStatus.AVAILABLE));
        resp.setReservedOffers(offerService.countByDonorAndStatus(donor.getId(), OfferStatus.RESERVED));
        resp.setPickedUpOffers(offerService.countByDonorAndStatus(donor.getId(), OfferStatus.PICKED_UP));
        resp.setCancelledOffers(offerService.countByDonorAndStatus(donor.getId(), OfferStatus.CANCELLED));
        resp.setOffers(offers);
        resp.setIncomingClaims(allClaims);
        return resp;
    }

    @Transactional(readOnly = true)
    public RecipientDashboardResponse getRecipientDashboard(User recipient) {
        List<ClaimResponse> claims = claimService.getClaimsByUser(recipient.getId());

        RecipientDashboardResponse resp = new RecipientDashboardResponse();
        resp.setTotalClaims(claims.size());
        resp.setPendingClaims(claimService.countByClaimerAndStatus(recipient.getId(), ClaimStatus.PENDING));
        resp.setAcceptedClaims(claimService.countByClaimerAndStatus(recipient.getId(), ClaimStatus.ACCEPTED));
        resp.setPickedUpClaims(claimService.countByClaimerAndStatus(recipient.getId(), ClaimStatus.PICKED_UP));
        resp.setClaims(claims);
        return resp;
    }
}
