package com.leboncoincoin.resource;

import com.leboncoincoin.entity.Listing;
import com.leboncoincoin.dto.CreateListingRequest;
import com.leboncoincoin.dto.UpdateListingRequest;
import com.leboncoincoin.dto.DeleteListingRequest;
import com.leboncoincoin.dto.ListingFilter;
import com.leboncoincoin.dto.ListingResponse;
import com.leboncoincoin.security.SecurityConfig;
import com.leboncoincoin.service.ListingService;
import com.leboncoincoin.service.UserService;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.math.BigDecimal;
import java.util.List;

@Path("/listings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ListingResource {

    @Inject
    ListingService listingService;

    @Inject
    UserService userService;

    @Inject
    SecurityConfig securityConfig;

    @Inject
    JsonWebToken jwt;

    @GET
    @PermitAll
    public Response getAllListings(
            @QueryParam("category") String category,
            @QueryParam("location") String location,
            @QueryParam("minPrice") BigDecimal minPrice,
            @QueryParam("maxPrice") BigDecimal maxPrice,
            @QueryParam("search") String searchTerm) {
        
        Log.infof("GET /listings - category=%s, location=%s, minPrice=%s, maxPrice=%s, search=%s",
                category, location, minPrice, maxPrice, searchTerm);

        ListingFilter filter = new ListingFilter(category, location, minPrice, maxPrice, searchTerm);
        List<Listing> listings = listingService.getListingsWithFilter(filter);
        List<ListingResponse> response = listings.stream()
                .map(ListingResponse::from)
                .toList();

        return Response.ok(response).build();
    }

    @GET
    @Path("/{id}")
    @PermitAll
    public Response getListingById(@PathParam("id") String id) {
        Log.infof("GET /listings/%s", id);
        
        Listing listing = listingService.getListingById(id);
        return Response.ok(ListingResponse.from(listing)).build();
    }

    @POST
    @Authenticated
    public Response create(@Valid CreateListingRequest request) {

        String email = null;
        String userId = null;
        String name = null;

        if (securityConfig.isAuthenticated()) {
            try {
                userId = securityConfig.getCurrentUserId();
            } catch (SecurityException ignored) {
                // fallback to JWT subject below
            }
            try {
                email = securityConfig.getCurrentUserEmail();
            } catch (SecurityException ignored) {
                // fallback to JWT claim below
            }
            name = securityConfig.getCurrentUserName();
        }

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

        if (email == null) {
            Log.error("ERREUR CRITIQUE: L'email est null malgré le token valide !");
            return Response.status(403)
                    .entity(new Error("Email claim not found in token. Available claims: " + jwt.getClaimNames()))
                    .build();
        }

        if (name == null) {
            name = "Utilisateur";
        }

        userService.ensureUserExists(userId, email, name);

        Listing listing = listingService.createListing(request, userId);
        return Response.status(Response.Status.CREATED)
                .entity(ListingResponse.from(listing))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Authenticated
    public Response updateListing(@PathParam("id") String id, @Valid UpdateListingRequest request) {
        Log.infof("PUT /listings/%s", id);
        
        String userId = securityConfig.getCurrentUserId();
        Listing listing = listingService.updateListing(id, request, userId);
        
        return Response.ok(ListingResponse.from(listing)).build();
    }

    @DELETE
    @Path("/{id}")
    @Authenticated
    public Response deleteListing(@PathParam("id") String id, @Valid DeleteListingRequest feedback) {
        Log.infof("DELETE /listings/%s with feedback: %s", id, feedback);
        
        String userId = securityConfig.getCurrentUserId();
        listingService.deleteListing(id, userId, feedback);
        
        return Response.noContent().build();
    }
}

