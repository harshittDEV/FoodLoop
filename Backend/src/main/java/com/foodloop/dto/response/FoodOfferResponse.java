package com.foodloop.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.foodloop.entity.FoodOffer;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Public representation of a food offer.
 * Field names match the frontend's mockData shape.
 * Does NOT expose the donor's email, password, or private data.
 */
public class FoodOfferResponse {

    private Long id;
    private Long donorId;
    private String donorName;
    private String donorType;
    private String title;
    private String description;
    private String category;
    private String quantity;
    private boolean isFree;
    private BigDecimal price;
    private Instant preparedAt;
    private Instant bestBefore;
    private Instant pickupStart;
    private Instant pickupEnd;
    private String pickupAddress;
    private String pickupInstructions;
    private Double lat;
    private Double lng;
    private List<String> dietaryTags;
    private List<String> allergens;
    private String status;
    private Instant createdAt;

    public FoodOfferResponse() {}

    public static FoodOfferResponse from(FoodOffer offer) {
        FoodOfferResponse r = new FoodOfferResponse();
        r.id = offer.getId();
        r.donorId = offer.getDonor().getId();
        r.donorName = offer.getDonor().getName();
        r.donorType = offer.getDonor().getRole().getFrontendValue();
        r.title = offer.getTitle();
        r.description = offer.getDescription();
        r.category = offer.getCategory();
        r.quantity = offer.getQuantity();
        r.isFree = offer.isFree();
        r.price = offer.getPrice();
        r.preparedAt = offer.getPreparedAt();
        r.bestBefore = offer.getBestBefore();
        r.pickupStart = offer.getPickupStart();
        r.pickupEnd = offer.getPickupEnd();
        r.pickupAddress = offer.getPickupAddress();
        r.pickupInstructions = offer.getPickupInstructions();
        r.lat = offer.getLat();
        r.lng = offer.getLng();
        r.dietaryTags = offer.getDietaryTags();
        r.allergens = offer.getAllergens();
        r.status = offer.getStatus().getFrontendValue();
        r.createdAt = offer.getCreatedAt();
        return r;
    }

    public Long getId()            { return id; }
    public Long getDonorId()       { return donorId; }
    public String getDonorName()   { return donorName; }
    public String getDonorType()   { return donorType; }
    public String getTitle()       { return title; }
    public String getDescription() { return description; }
    public String getCategory()    { return category; }
    public String getQuantity()    { return quantity; }
    @JsonProperty("isFree")
    public boolean isFree()        { return isFree; }
    public BigDecimal getPrice()   { return price; }
    public Instant getPreparedAt() { return preparedAt; }
    public Instant getBestBefore() { return bestBefore; }
    public Instant getPickupStart(){ return pickupStart; }
    public Instant getPickupEnd()  { return pickupEnd; }
    public String getPickupAddress()  { return pickupAddress; }
    public String getPickupInstructions() { return pickupInstructions; }
    public Double getLat()         { return lat; }
    public Double getLng()         { return lng; }
    public List<String> getDietaryTags() { return dietaryTags; }
    public List<String> getAllergens()    { return allergens; }
    public String getStatus()      { return status; }
    public Instant getCreatedAt()  { return createdAt; }
}
