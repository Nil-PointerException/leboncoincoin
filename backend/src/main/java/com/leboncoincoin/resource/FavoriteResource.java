package com.leboncoincoin.resource;

import com.leboncoincoin.dto.FavoriteResponse;
import com.leboncoincoin.dto.ListingResponse;
import com.leboncoincoin.entity.Favorite;
import com.leboncoincoin.entity.Listing;
import com.leboncoincoin.exception.ResourceNotFoundException;
import com.leboncoincoin.repository.FavoriteRepository;
import com.leboncoincoin.repository.ListingRepository;
import com.leboncoincoin.security.SecurityConfig;
import com.leboncoincoin.service.UserService;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.Optional;

@Path("/favorites")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class FavoriteResource {

    @Inject
    FavoriteRepository favoriteRepository;

    @Inject
    ListingRepository listingRepository;

    @Inject
    UserService userService;

    @Inject
    SecurityConfig securityConfig;

    @Inject
    JsonWebToken jwt;

    /**
     * Get all favorites for the current user
     */
    @GET
    public Response getFavorites() {
        String userId = securityConfig.getCurrentUserId();
        Log.infof("GET /favorites for user %s", userId);

        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<FavoriteResponse> response = favorites.stream()
                .map(FavoriteResponse::from)
                .toList();

        return Response.ok(response).build();
    }

    /**
     * Get all favorite listings (full listing details) for the current user
     */
    @GET
    @Path("/listings")
    public Response getFavoriteListings() {
        String userId = securityConfig.getCurrentUserId();
        Log.infof("GET /favorites/listings for user %s", userId);

        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<ListingResponse> listings = favorites.stream()
                .map(favorite -> listingRepository.findByIdOptional(favorite.listingId))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(ListingResponse::from)
                .toList();

        return Response.ok(listings).build();
    }

    /**
     * Add a listing to favorites
     */
    @POST
    @Path("/{listingId}")
    @Transactional
    public Response addFavorite(@PathParam("listingId") String listingId) {
        String userId = securityConfig.getCurrentUserId();
        Object emailObj = jwt.getClaim("email");
        String email = (emailObj != null) ? emailObj.toString() : null;
        String name = securityConfig.getCurrentUserName();

        Log.infof("POST /favorites/%s for user %s", listingId, userId);

        // Ensure user exists in database
        userService.ensureUserExists(userId, email, name);

        // Check if listing exists
        Listing listing = listingRepository.findByIdOptional(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        // Check if already favorited
        if (favoriteRepository.existsByUserIdAndListingId(userId, listingId)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"message\": \"Listing is already in favorites\"}")
                    .build();
        }

        // Create favorite
        Favorite favorite = new Favorite(userId, listingId);
        favoriteRepository.persist(favorite);

        return Response.status(Response.Status.CREATED)
                .entity(FavoriteResponse.from(favorite))
                .build();
    }

    /**
     * Remove a listing from favorites
     */
    @DELETE
    @Path("/{listingId}")
    @Transactional
    public Response removeFavorite(@PathParam("listingId") String listingId) {
        String userId = securityConfig.getCurrentUserId();
        Log.infof("DELETE /favorites/%s for user %s", listingId, userId);

        long deleted = favoriteRepository.deleteByUserIdAndListingId(userId, listingId);

        if (deleted == 0) {
            throw new ResourceNotFoundException("Favorite not found");
        }

        return Response.noContent().build();
    }

    /**
     * Check if a listing is favorited by the current user
     */
    @GET
    @Path("/{listingId}/status")
    public Response getFavoriteStatus(@PathParam("listingId") String listingId) {
        String userId = securityConfig.getCurrentUserId();
        Log.infof("GET /favorites/%s/status for user %s", listingId, userId);

        boolean isFavorited = favoriteRepository.existsByUserIdAndListingId(userId, listingId);

        return Response.ok()
                .entity("{\"isFavorited\": " + isFavorited + "}")
                .build();
    }
}

