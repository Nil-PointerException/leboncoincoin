package com.lmc.repository;

import com.lmc.domain.Listing;
import com.lmc.dto.ListingFilter;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ListingRepository implements PanacheRepositoryBase<Listing, String> {

    public List<Listing> findByUserId(String userId) {
        return list("userId", Sort.descending("createdAt"), userId);
    }

    public List<Listing> findAllSorted() {
        return listAll(Sort.descending("createdAt"));
    }

    public List<Listing> findWithFilter(ListingFilter filter) {
        if (filter == null || !filter.hasFilters()) {
            return findAllSorted();
        }

        StringBuilder query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();

        // Category filter
        if (filter.category() != null && !filter.category().isBlank()) {
            query.append(" AND LOWER(category) = LOWER(:category)");
            params.put("category", filter.category());
        }

        // Location filter (partial match)
        if (filter.location() != null && !filter.location().isBlank()) {
            query.append(" AND LOWER(location) LIKE LOWER(:location)");
            params.put("location", "%" + filter.location() + "%");
        }

        // Price range filters
        if (filter.minPrice() != null) {
            query.append(" AND price >= :minPrice");
            params.put("minPrice", filter.minPrice());
        }

        if (filter.maxPrice() != null) {
            query.append(" AND price <= :maxPrice");
            params.put("maxPrice", filter.maxPrice());
        }

        // Search term (title or description)
        if (filter.searchTerm() != null && !filter.searchTerm().isBlank()) {
            query.append(" AND (LOWER(title) LIKE LOWER(:search) OR LOWER(description) LIKE LOWER(:search))");
            params.put("search", "%" + filter.searchTerm() + "%");
        }

        PanacheQuery<Listing> panacheQuery = find(query.toString(), Sort.descending("createdAt"), params);
        return panacheQuery.list();
    }

    public long countByUserId(String userId) {
        return count("userId", userId);
    }
}
