package com.leboncoincoin.dto;

import com.leboncoincoin.entity.Favorite;
import java.time.Instant;

public record FavoriteResponse(
    String id,
    String userId,
    String listingId,
    Instant createdAt
) {
    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(
            favorite.id,
            favorite.userId,
            favorite.listingId,
            favorite.createdAt
        );
    }
}

