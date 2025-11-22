package com.lmc.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "messages")
public class Message extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    public Conversation conversation;

    @Column(nullable = false)
    public String senderId;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String content;

    @Column(nullable = false, updatable = false)
    public LocalDateTime sentAt;

    @Column(nullable = false)
    public boolean isRead;

    @PrePersist
    public void prePersist() {
        sentAt = LocalDateTime.now();
        if (!isRead) {
            isRead = false;
        }
    }

    // Finder methods
    public static List<Message> findByConversationId(String conversationId) {
        return list("conversation.id = ?1 ORDER BY sentAt ASC", conversationId);
    }

    public static long countUnreadByUserId(String userId) {
        return count("conversation.buyerId = ?1 OR conversation.sellerId = ?1 AND isRead = false", userId);
    }
}

