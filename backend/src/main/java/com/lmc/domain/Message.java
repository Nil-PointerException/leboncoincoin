package com.lmc.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * Message entity for future implementation
 * Optional for MVP - can be implemented in phase 2
 */
@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_listing_id", columnList = "listing_id"),
    @Index(name = "idx_from_user_id", columnList = "from_user_id"),
    @Index(name = "idx_to_user_id", columnList = "to_user_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class Message {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "listing_id", nullable = false, length = 36)
    private String listingId;

    @Column(name = "from_user_id", nullable = false, length = 255)
    private String fromUserId;

    @Column(name = "to_user_id", nullable = false, length = 255)
    private String toUserId;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public Message() {
    }

    public Message(String listingId, String fromUserId, String toUserId, String content) {
        this.id = UUID.randomUUID().toString();
        this.listingId = listingId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.content = content;
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

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getListingId() {
        return listingId;
    }

    public void setListingId(String listingId) {
        this.listingId = listingId;
    }

    public String getFromUserId() {
        return fromUserId;
    }

    public void setFromUserId(String fromUserId) {
        this.fromUserId = fromUserId;
    }

    public String getToUserId() {
        return toUserId;
    }

    public void setToUserId(String toUserId) {
        this.toUserId = toUserId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Message message = (Message) o;
        return Objects.equals(id, message.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Message{" +
                "id='" + id + '\'' +
                ", listingId='" + listingId + '\'' +
                ", fromUserId='" + fromUserId + '\'' +
                ", toUserId='" + toUserId + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
