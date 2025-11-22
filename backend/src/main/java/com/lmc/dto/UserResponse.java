package com.lmc.dto;

import com.lmc.entity.User;

import java.time.Instant;

public record UserResponse(
    String id,
    String email,
    String name,
    Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.id,
            user.email,
            user.name,
            user.createdAt
        );
    }
}

