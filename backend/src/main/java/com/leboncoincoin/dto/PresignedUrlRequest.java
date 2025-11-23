package com.leboncoincoin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PresignedUrlRequest(
    @NotBlank(message = "Filename is required")
    String filename,
    
    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "image/(jpeg|jpg|png|gif|webp)", message = "Only image files are allowed")
    String contentType
) {
}

