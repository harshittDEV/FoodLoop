package com.foodloop.service;

import com.foodloop.dto.request.CreateOfferRequest;
import com.foodloop.dto.request.UpdateOfferRequest;
import com.foodloop.dto.response.FoodOfferResponse;
import com.foodloop.dto.response.PageResponse;
import com.foodloop.entity.*;
import com.foodloop.exception.ApiException;
import com.foodloop.repository.FoodOfferRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
public class FoodOfferService {

    private final FoodOfferRepository offerRepo;

    public FoodOfferService(FoodOfferRepository offerRepo) {
        this.offerRepo = offerRepo;
    }

    @Transactional
    public FoodOfferResponse create(CreateOfferRequest req, User donor) {
        validateDonorRole(donor);
        validateTimestamps(req.getPickupStart(), req.getPickupEnd());
        validatePrice(req.isFree(), req.getPrice());

        FoodOffer offer = new FoodOffer();
        offer.setDonor(donor);
        offer.setTitle(req.getTitle().trim());
        offer.setDescription(req.getDescription().trim());
        offer.setCategory(req.getCategory().trim());
        offer.setQuantity(req.getQuantity().trim());
        offer.setFree(req.isFree());
        offer.setPrice(req.isFree() ? BigDecimal.ZERO : req.getPrice());
        offer.setPreparedAt(req.getPreparedAt());
        offer.setBestBefore(req.getBestBefore());
        offer.setPickupStart(req.getPickupStart());
        offer.setPickupEnd(req.getPickupEnd());
        offer.setPickupAddress(req.getPickupAddress().trim());
        offer.setPickupInstructions(req.getPickupInstructions());
        offer.setLat(req.getLat());
        offer.setLng(req.getLng());
        offer.setDietaryTags(req.getDietaryTags() != null ? req.getDietaryTags() : Collections.emptyList());
        offer.setAllergens(req.getAllergens() != null ? req.getAllergens() : Collections.emptyList());

        offer = offerRepo.save(offer);
        return FoodOfferResponse.from(offer);
    }

    @Transactional
    public FoodOfferResponse update(Long offerId, UpdateOfferRequest req, User donor) {
        FoodOffer offer = getOwnedOffer(offerId, donor);

        if (offer.getStatus() != OfferStatus.AVAILABLE) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Only available offers can be edited.");
        }

        if (req.getTitle() != null)             offer.setTitle(req.getTitle().trim());
        if (req.getDescription() != null)       offer.setDescription(req.getDescription().trim());
        if (req.getCategory() != null)          offer.setCategory(req.getCategory().trim());
        if (req.getQuantity() != null)          offer.setQuantity(req.getQuantity().trim());
        if (req.getIsFree() != null) {
            offer.setFree(req.getIsFree());
            if (req.getIsFree()) offer.setPrice(BigDecimal.ZERO);
        }
        if (req.getPrice() != null && !offer.isFree())  offer.setPrice(req.getPrice());
        if (req.getPreparedAt() != null)        offer.setPreparedAt(req.getPreparedAt());
        if (req.getBestBefore() != null)        offer.setBestBefore(req.getBestBefore());
        if (req.getPickupStart() != null)       offer.setPickupStart(req.getPickupStart());
        if (req.getPickupEnd() != null)         offer.setPickupEnd(req.getPickupEnd());
        if (req.getPickupAddress() != null)     offer.setPickupAddress(req.getPickupAddress().trim());
        if (req.getPickupInstructions() != null) offer.setPickupInstructions(req.getPickupInstructions());
        if (req.getLat() != null)               offer.setLat(req.getLat());
        if (req.getLng() != null)               offer.setLng(req.getLng());
        if (req.getDietaryTags() != null)       offer.setDietaryTags(req.getDietaryTags());
        if (req.getAllergens() != null)          offer.setAllergens(req.getAllergens());

        offer = offerRepo.save(offer);
        return FoodOfferResponse.from(offer);
    }

    @Transactional
    public void cancel(Long offerId, User donor) {
        FoodOffer offer = getOwnedOffer(offerId, donor);
        if (offer.getStatus() == OfferStatus.PICKED_UP) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Cannot cancel an offer that has already been picked up.");
        }
        if (offer.getStatus() == OfferStatus.CANCELLED) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "This offer is already cancelled.");
        }
        offer.setStatus(OfferStatus.CANCELLED);
        offerRepo.save(offer);
    }

    @Transactional(readOnly = true)
    public FoodOfferResponse getById(Long id) {
        FoodOffer offer = offerRepo.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Food offer not found."));
        return FoodOfferResponse.from(offer);
    }

    @Transactional(readOnly = true)
    public PageResponse<FoodOfferResponse> browse(
            String search, String category, String donorType, String priceType,
            int page, int size) {

        if (size > 50) size = 50;
        if (size < 1) size = 12;
        if (page < 0) page = 0;

        Role donorRole = null;
        if (donorType != null && !donorType.isBlank() && !"all".equals(donorType)) {
            donorRole = Role.fromFrontendValue(donorType);
        }

        Boolean isFree = null;
        if ("free".equals(priceType))  isFree = true;
        if ("paid".equals(priceType))  isFree = false;

        String searchTerm = (search != null && !search.isBlank()) ? search.trim() : null;
        String categoryTerm = (category != null && !category.isBlank()) ? category.trim() : null;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FoodOffer> result = offerRepo.browse(
            OfferStatus.AVAILABLE, searchTerm, categoryTerm, donorRole, isFree, pageable);

        return PageResponse.from(result, FoodOfferResponse::from);
    }

    @Transactional(readOnly = true)
    public List<FoodOfferResponse> getByDonor(Long donorId) {
        return offerRepo.findByDonorIdOrderByCreatedAtDesc(donorId).stream()
            .map(FoodOfferResponse::from)
            .toList();
    }

    // ── Helpers ────────────────────────────────────

    public FoodOffer getOwnedOffer(Long offerId, User donor) {
        FoodOffer offer = offerRepo.findById(offerId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Food offer not found."));
        if (!offer.getDonor().getId().equals(donor.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "You can only manage your own offers.");
        }
        return offer;
    }

    FoodOffer getOfferEntity(Long offerId) {
        return offerRepo.findById(offerId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Food offer not found."));
    }

    long countByDonorAndStatus(Long donorId, OfferStatus status) {
        return offerRepo.countByDonorIdAndStatus(donorId, status);
    }

    private void validateDonorRole(User user) {
        if (user.getRole() != Role.INDIVIDUAL_DONOR && user.getRole() != Role.RESTAURANT_DONOR) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "Only donors can create food offers.");
        }
        if (!user.isVerified()) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                "Please verify your email before creating offers.");
        }
    }

    private void validateTimestamps(java.time.Instant pickupStart, java.time.Instant pickupEnd) {
        if (pickupEnd != null && pickupStart != null && pickupEnd.isBefore(pickupStart)) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Pickup end must be after pickup start.");
        }
    }

    private void validatePrice(boolean isFree, BigDecimal price) {
        if (!isFree && (price == null || price.compareTo(BigDecimal.ZERO) < 0)) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                "Non-free offers must have a non-negative price.");
        }
    }
}
