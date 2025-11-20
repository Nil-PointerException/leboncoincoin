package com.lmc.dto;

import com.lmc.domain.Listing;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ListingResponse(
    String id,
    String title,
    String description,
    BigDecimal price,
    String category,
    String location,
    List<String> imageUrls,
    String userId,
    Instant createdAt
) {
    public static ListingResponse from(Listing listing) {
        return new ListingResponse(
            listing.getId(),
            listing.getTitle(),
            listing.getDescription(),
            listing.getPrice(),
            listing.getCategory(),
            listing.getLocation(),
            listing.getImageUrls(),
            listing.getUserId(),
            listing.getCreatedAt()
        );
    }
}

