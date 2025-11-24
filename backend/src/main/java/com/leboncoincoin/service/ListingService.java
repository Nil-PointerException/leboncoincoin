package com.leboncoincoin.service;

import com.leboncoincoin.entity.Conversation;
import com.leboncoincoin.entity.Listing;
import com.leboncoincoin.dto.CreateListingRequest;
import com.leboncoincoin.dto.UpdateListingRequest;
import com.leboncoincoin.dto.DeleteListingRequest;
import com.leboncoincoin.dto.ListingFilter;
import com.leboncoincoin.exception.ResourceNotFoundException;
import com.leboncoincoin.repository.ListingRepository;
import com.leboncoincoin.security.SecurityConfig;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class ListingService {

    @Inject
    ListingRepository listingRepository;

    @Inject
    SecurityConfig securityConfig;

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
        Listing listing = listingRepository.findByIdAndNotDeleted(id);
        if (listing == null) {
            throw new ResourceNotFoundException("Listing not found with id: " + id);
        }
        return listing;
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
    public Listing updateListing(String id, UpdateListingRequest request, String userId) {
        Log.infof("Updating listing: id=%s, userId=%s", id, userId);
        
        Listing listing = getListingById(id);
        
        // Verify ownership
        if (!listing.userId.equals(userId)) {
            throw new SecurityException("You are not authorized to update this listing");
        }
        
        // Update fields
        listing.title = request.title();
        listing.description = request.description();
        listing.price = request.price();
        listing.category = request.category();
        listing.location = request.location();
        listing.imageUrls = request.imageUrls() != null 
            ? request.imageUrls() 
            : listing.imageUrls;
        
        // updatedAt will be automatically set by @PreUpdate
        listingRepository.persist(listing);
        return listing;
    }

    @Transactional
    public void deleteListing(String id, String userId, DeleteListingRequest feedback) {
        Log.infof("Deleting listing: id=%s, userId=%s, reason=%s, wasSold=%s", 
            id, userId, feedback.reason(), feedback.wasSold());
        
        Listing listing = getListingById(id);
        
        // Verify ownership OR admin role
        boolean isOwner = listing.userId.equals(userId);
        boolean isAdmin = securityConfig.isAdmin();
        
        if (!isOwner && !isAdmin) {
            throw new SecurityException("You are not authorized to delete this listing");
        }
        
        if (isAdmin && !isOwner) {
            Log.infof("Admin %s is deleting listing %s (owner: %s)", userId, id, listing.userId);
        }
        
        // Store deletion feedback and mark as soft-deleted
        listing.deletedAt = Instant.now();
        listing.deletionReason = feedback.reason().name();
        listing.wasSold = feedback.wasSold();
        
        listingRepository.persist(listing);
        
        // Delete associated conversations (hard delete) since listing is soft-deleted
        List<Conversation> conversations = Conversation.findByListingId(id);
        for (Conversation conversation : conversations) {
            conversation.delete();
        }
        
        Log.infof("Listing %s soft-deleted with feedback for analytics, deleted %d conversations", id, conversations.size());
    }
}
