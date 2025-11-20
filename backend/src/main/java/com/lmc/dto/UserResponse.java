package com.lmc.dto;

import com.lmc.domain.User;

import java.time.Instant;

public record UserResponse(
    String id,
    String email,
    String name,
    Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getCreatedAt()
        );
    }
}

