package com.lmc.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "conversations")
public class Conversation extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @Column(nullable = false)
    public String listingId;

    @Column(nullable = false)
    public String buyerId;

    @Column(nullable = false)
    public String sellerId;

    @Column(nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @Column(nullable = false)
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

