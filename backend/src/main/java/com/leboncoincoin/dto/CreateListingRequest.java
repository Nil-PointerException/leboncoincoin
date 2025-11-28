package com.leboncoincoin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.util.List;

public record CreateListingRequest(
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    String title,
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 5000, message = "Description must be between 10 and 5000 characters")
    String description,
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @DecimalMax(value = "999999999.99", message = "Price cannot exceed 999,999,999.99")
    BigDecimal price,
    
    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    String category,
    
    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 100, message = "Location must be between 2 and 100 characters")
    String location,
    
    @NotEmpty(message = "At least one image is required")
    @Size(max = 10, message = "Maximum 10 images allowed")
    List<String> imageUrls
) {
}

