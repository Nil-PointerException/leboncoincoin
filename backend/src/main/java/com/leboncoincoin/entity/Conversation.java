package com.leboncoincoin.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "conversations")
public class Conversation extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    public String id;

    @Column(name = "listing_id", nullable = false, length = 36)
    public String listingId;

    @Column(name = "buyer_id", nullable = false, length = 255)
    public String buyerId;

    @Column(name = "seller_id", nullable = false, length = 255)
    public String sellerId;

    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Message> messages;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Finder methods
    public static List<Conversation> findByUserId(String userId) {
        return list("buyerId = ?1 OR sellerId = ?1 ORDER BY updatedAt DESC", userId);
    }

    public static Conversation findByListingAndUsers(String listingId, String buyerId, String sellerId) {
        return find("listingId = ?1 AND buyerId = ?2 AND sellerId = ?3", listingId, buyerId, sellerId)
                .firstResult();
    }

    public static List<Conversation> findByListingId(String listingId) {
        return list("listingId = ?1 ORDER BY updatedAt DESC", listingId);
    }
}


