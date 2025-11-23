package com.leboncoincoin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
    @NotBlank(message = "Le message ne peut pas être vide")
    @Size(max = 5000, message = "Le message ne peut pas dépasser 5000 caractères")
    String content
) {}


