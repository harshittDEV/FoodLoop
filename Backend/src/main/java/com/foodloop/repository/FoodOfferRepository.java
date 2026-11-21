package com.foodloop.repository;

import com.foodloop.entity.FoodOffer;
import com.foodloop.entity.OfferStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodOfferRepository extends JpaRepository<FoodOffer, Long> {

    Page<FoodOffer> findByStatus(OfferStatus status, Pageable pageable);

    @Query("""
        SELECT o FROM FoodOffer o JOIN FETCH o.donor
        WHERE o.status = :status
          AND (:search IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%',:search,'%'))
               OR LOWER(o.description) LIKE LOWER(CONCAT('%',:search,'%')))
          AND (:category IS NULL OR o.category = :category)
          AND (:donorRole IS NULL OR o.donor.role = :donorRole)
          AND (:isFree IS NULL OR o.free = :isFree)
    """)
    Page<FoodOffer> browse(
        @Param("status") OfferStatus status,
        @Param("search") String search,
        @Param("category") String category,
        @Param("donorRole") com.foodloop.entity.Role donorRole,
        @Param("isFree") Boolean isFree,
        Pageable pageable
    );

    List<FoodOffer> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    @Query("SELECT COUNT(o) FROM FoodOffer o WHERE o.donor.id = :donorId AND o.status = :status")
    long countByDonorIdAndStatus(@Param("donorId") Long donorId, @Param("status") OfferStatus status);
}
