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
import org.eclipse.microprofile.config.inject.ConfigProperty;
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

    @ConfigProperty(name = "app.dev.test-user-email", defaultValue = "dev@leboncoincoin.local")
    Optional<String> devUserEmail;

    @ConfigProperty(name = "app.dev.test-user-name", defaultValue = "Dev User")
    Optional<String> devUserName;

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
        String userId = null;
        String email = null;
        String name = null;

        // Try to get user info from SecurityConfig first (works in dev mode)
        if (securityConfig.isAuthenticated()) {
            try {
                userId = securityConfig.getCurrentUserId();
            } catch (SecurityException ignored) {
                // fallback to JWT subject below
            }
            // Try to get email, but don't fail if not available
            try {
                email = securityConfig.getCurrentUserEmail();
            } catch (SecurityException e) {
                Log.debugf("Email not found via SecurityConfig, will try JWT: %s", e.getMessage());
                // fallback to JWT claim below
            }
            name = securityConfig.getCurrentUserName();
            if (name == null || name.equals("Unknown User")) {
                name = "Utilisateur";
            }
        }

        // Fallback to JWT if SecurityConfig didn't work
        if (jwt != null) {
            if (userId == null) {
                userId = jwt.getSubject();
            }
            if (email == null) {
                Object emailObj = jwt.getClaim("email");
                email = emailObj != null ? emailObj.toString() : null;
            }
            if (name == null || name.equals("Unknown User")) {
                Object nameObj = jwt.getClaim("name");
                name = nameObj != null ? nameObj.toString() : null;
            }
        }

        // Fallback to dev config values if still null
        if (email == null && devUserEmail.isPresent()) {
            email = devUserEmail.get();
            Log.debugf("Using dev email from config: %s", email);
        }
        if (name == null || name.equals("Unknown User")) {
            name = devUserName.orElse("Utilisateur");
            Log.debugf("Using dev name from config: %s", name);
        }

        if (userId == null) {
            Log.error("ERREUR CRITIQUE: Impossible de récupérer l'ID utilisateur pour ajouter un favori !");
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("{\"message\": \"User ID not found. Authentication required.\"}")
                    .build();
        }

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

