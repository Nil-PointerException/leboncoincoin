package com.lmc.dto;

import com.lmc.entity.Conversation;
import java.time.LocalDateTime;

public record ConversationResponse(
    String id,
    String listingId,
    String buyerId,
    String sellerId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    MessageResponse lastMessage,
    int unreadCount
) {
    public static ConversationResponse from(Conversation conversation, MessageResponse lastMessage, int unreadCount) {
        return new ConversationResponse(
            conversation.id,
            conversation.listingId,
            conversation.buyerId,
            conversation.sellerId,
            conversation.createdAt,
            conversation.updatedAt,
            lastMessage,
            unreadCount
        );
    }
}

