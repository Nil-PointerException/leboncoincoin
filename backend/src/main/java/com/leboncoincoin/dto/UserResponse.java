package com.leboncoincoin.dto;

import com.leboncoincoin.entity.User;
import com.leboncoincoin.entity.UserRole;

import java.time.Instant;

public record UserResponse(
    String id,
    String email,
    String name,
    UserRole role,
    Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.id,
            user.email,
            user.name,
            user.role,
            user.createdAt
        );
    }
}

