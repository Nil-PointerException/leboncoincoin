package com.leboncoincoin.dto;

import jakarta.validation.constraints.NotNull;

public record DeleteListingRequest(
    @NotNull(message = "Deletion reason is required")
    DeletionReason reason,
    
    Boolean wasSold  // Optional - only relevant if reason is SOLD or NO_LONGER_AVAILABLE
) {
    public enum DeletionReason {
        SOLD,                  // Item was sold
        NO_LONGER_AVAILABLE,   // Item no longer available (given away, kept, etc.)
        OTHER                  // Other reason (mistake, duplicate, etc.)
    }
}

