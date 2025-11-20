package com.lmc.dto;

import java.math.BigDecimal;

/**
 * Filter parameters for listing search
 */
public record ListingFilter(
    String category,
    String location,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    String searchTerm
) {
    public boolean hasFilters() {
        return category != null || location != null || 
               minPrice != null || maxPrice != null || 
               searchTerm != null;
    }
}

