package com.lmc.service;

import com.lmc.entity.Listing;
import com.lmc.dto.CreateListingRequest;
import com.lmc.dto.ListingFilter;
import com.lmc.exception.ResourceNotFoundException;
import com.lmc.repository.ListingRepository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ListingService {

    @Inject
    ListingRepository listingRepository;

    @Transactional
    public Listing createListing(CreateListingRequest request, String userId) {
        Log.infof("Creating listing for user: %s", userId);
        
        Listing listing = new Listing(
            request.title(),
            request.description(),
            request.price(),
            request.category(),
            request.location(),
            request.imageUrls(),
            userId
        );
        
        listingRepository.persist(listing);
        return listing;
    }

    public Listing getListingById(String id) {
        Log.debugf("Getting listing by id: %s", id);
        return listingRepository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));
    }

    public List<Listing> getAllListings() {
        Log.debug("Getting all listings");
        return listingRepository.findAllSorted();
    }

    public List<Listing> getListingsWithFilter(ListingFilter filter) {
        Log.debugf("Getting listings with filter: %s", filter);
        
        if (filter == null || !filter.hasFilters()) {
            return getAllListings();
        }
        
        return listingRepository.findWithFilter(filter);
    }

    public List<Listing> getListingsByUserId(String userId) {
        Log.debugf("Getting listings by userId: %s", userId);
        return listingRepository.findByUserId(userId);
    }

    @Transactional
    public void deleteListing(String id, String userId) {
        Log.infof("Deleting listing: id=%s, userId=%s", id, userId);
        
        Listing listing = getListingById(id);
        
        // Verify ownership
        if (!listing.userId.equals(userId)) {
            throw new SecurityException("You are not authorized to delete this listing");
        }
        
        listingRepository.delete(listing);
    }
}
