package com.lmc.resource;

import com.lmc.domain.Listing;
import com.lmc.dto.CreateListingRequest;
import com.lmc.dto.ListingFilter;
import com.lmc.dto.ListingResponse;
import com.lmc.security.SecurityConfig;
import com.lmc.service.ListingService;
import com.lmc.service.UserService;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    public Response createListing(@Valid CreateListingRequest request) {
        Log.info("POST /listings");
        
        String userId = securityConfig.getCurrentUserId();
        String email = securityConfig.getCurrentUserEmail();
        String name = securityConfig.getCurrentUserName();

        // Ensure user exists in database
        userService.ensureUserExists(userId, email, name);

        Listing listing = listingService.createListing(request, userId);
        return Response.status(Response.Status.CREATED)
                .entity(ListingResponse.from(listing))
                .build();
    }

    @DELETE
    @Path("/{id}")
    @Authenticated
    public Response deleteListing(@PathParam("id") String id) {
        Log.infof("DELETE /listings/%s", id);
        
        String userId = securityConfig.getCurrentUserId();
        listingService.deleteListing(id, userId);
        
        return Response.noContent().build();
    }
}

