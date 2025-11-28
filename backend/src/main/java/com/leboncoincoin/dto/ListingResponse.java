package com.leboncoincoin.dto;

import com.leboncoincoin.entity.Listing;
import com.leboncoincoin.entity.User;

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
    String userName,
    String userEmail,
    Instant createdAt,
    Instant updatedAt
) {
    public static ListingResponse from(Listing listing) {
        // Récupérer les informations de l'utilisateur
        User user = User.findById(listing.userId);
        String userName = user != null ? user.name : "Utilisateur inconnu";
        String userEmail = user != null ? user.email : null;
        
        return new ListingResponse(
            listing.id,
            listing.title,
            listing.description,
            listing.price,
            listing.category,
            listing.location,
            listing.imageUrls,
            listing.userId,
            userName,
            userEmail,
            listing.createdAt,
            listing.updatedAt
        );
    }
}

