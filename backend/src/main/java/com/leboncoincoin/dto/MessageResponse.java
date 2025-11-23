package com.leboncoincoin.dto;

import com.leboncoincoin.entity.Message;
import java.time.LocalDateTime;

public record MessageResponse(
    String id,
    String conversationId,
    String senderId,
    String content,
    LocalDateTime sentAt,
    boolean isRead
) {
    public static MessageResponse from(Message message) {
        return new MessageResponse(
            message.id,
            message.conversation.id,
            message.senderId,
            message.content,
            message.sentAt,
            message.isRead
        );
    }
}


