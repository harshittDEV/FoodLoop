package com.foodloop.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class CreateOfferRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be under 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be under 100 characters")
    private String category;

    @NotBlank(message = "Quantity is required")
    @Size(max = 100, message = "Quantity must be under 100 characters")
    private String quantity;

    @JsonProperty("isFree")
    private boolean isFree = true;

    @DecimalMin(value = "0.00", message = "Price must be non-negative")
    private BigDecimal price;

    private Instant preparedAt;

    @NotNull(message = "Best-before date is required")
    private Instant bestBefore;

    @NotNull(message = "Pickup start time is required")
    private Instant pickupStart;

    @NotNull(message = "Pickup end time is required")
    private Instant pickupEnd;

    @NotBlank(message = "Pickup address is required")
    @Size(max = 500, message = "Pickup address must be under 500 characters")
    private String pickupAddress;

    @Size(max = 2000, message = "Instructions must be under 2000 characters")
    private String pickupInstructions;

    private Double lat;
    private Double lng;

    private List<String> dietaryTags;
    private List<String> allergens;

    public CreateOfferRequest() {}

    public String getTitle()          { return title; }
    public String getDescription()    { return description; }
    public String getCategory()       { return category; }
    public String getQuantity()       { return quantity; }
    @JsonProperty("isFree")
    public boolean isFree()           { return isFree; }
    public BigDecimal getPrice()      { return price; }
    public Instant getPreparedAt()    { return preparedAt; }
    public Instant getBestBefore()    { return bestBefore; }
    public Instant getPickupStart()   { return pickupStart; }
    public Instant getPickupEnd()     { return pickupEnd; }
    public String getPickupAddress()  { return pickupAddress; }
    public String getPickupInstructions() { return pickupInstructions; }
    public Double getLat()            { return lat; }
    public Double getLng()            { return lng; }
    public List<String> getDietaryTags() { return dietaryTags; }
    public List<String> getAllergens() { return allergens; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    @JsonProperty("isFree")
    public void setFree(boolean free) { this.isFree = free; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setPreparedAt(Instant preparedAt) { this.preparedAt = preparedAt; }
    public void setBestBefore(Instant bestBefore) { this.bestBefore = bestBefore; }
    public void setPickupStart(Instant pickupStart) { this.pickupStart = pickupStart; }
    public void setPickupEnd(Instant pickupEnd) { this.pickupEnd = pickupEnd; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public void setPickupInstructions(String pickupInstructions) { this.pickupInstructions = pickupInstructions; }
    public void setLat(Double lat) { this.lat = lat; }
    public void setLng(Double lng) { this.lng = lng; }
    public void setDietaryTags(List<String> dietaryTags) { this.dietaryTags = dietaryTags; }
    public void setAllergens(List<String> allergens) { this.allergens = allergens; }
}
