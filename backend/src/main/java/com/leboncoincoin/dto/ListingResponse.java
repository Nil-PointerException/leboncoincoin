package com.leboncoincoin.dto;

import com.leboncoincoin.entity.Listing;

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
            listing.id,
            listing.title,
            listing.description,
            listing.price,
            listing.category,
            listing.location,
            listing.imageUrls,
            listing.userId,
            listing.createdAt
        );
    }
}

