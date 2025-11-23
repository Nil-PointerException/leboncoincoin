package com.leboncoincoin.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "favorites", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "listing_id"}))
public class Favorite extends PanacheEntityBase {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    public String id;

    @Column(name = "user_id", nullable = false, length = 255)
    public String userId;

    @Column(name = "listing_id", nullable = false, length = 36)
    public String listingId;

    @Column(name = "created_at", nullable = false)
    public Instant createdAt;

    public Favorite() {
    }

    public Favorite(String userId, String listingId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.listingId = listingId;
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Favorite favorite = (Favorite) o;
        return Objects.equals(id, favorite.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Favorite{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", listingId='" + listingId + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}

