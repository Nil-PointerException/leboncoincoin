package com.leboncoincoin.repository;

import com.leboncoincoin.entity.Favorite;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class FavoriteRepository implements PanacheRepositoryBase<Favorite, String> {

    public List<Favorite> findByUserId(String userId) {
        return list("userId", userId);
    }

    public Optional<Favorite> findByUserIdAndListingId(String userId, String listingId) {
        return find("userId = ?1 and listingId = ?2", userId, listingId).firstResultOptional();
    }

    public boolean existsByUserIdAndListingId(String userId, String listingId) {
        return count("userId = ?1 and listingId = ?2", userId, listingId) > 0;
    }

    public long deleteByUserIdAndListingId(String userId, String listingId) {
        return delete("userId = ?1 and listingId = ?2", userId, listingId);
    }
}

