package com.leboncoincoin.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateConversationRequest(
    @NotBlank(message = "L'ID de l'annonce est requis")
    String listingId,
    
    @NotBlank(message = "Le message initial est requis")
    String initialMessage
) {}


