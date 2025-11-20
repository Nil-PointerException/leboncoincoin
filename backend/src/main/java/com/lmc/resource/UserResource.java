package com.lmc.resource;

import com.lmc.domain.User;
import com.lmc.dto.ListingResponse;
import com.lmc.dto.UserResponse;
import com.lmc.security.SecurityConfig;
import com.lmc.service.ListingService;
import com.lmc.service.UserService;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/me")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserResource {

    @Inject
    UserService userService;

    @Inject
    ListingService listingService;

    @Inject
    SecurityConfig securityConfig;

    @GET
    public Response getCurrentUser() {
        Log.info("GET /me");
        
        String userId = securityConfig.getCurrentUserId();
        String email = securityConfig.getCurrentUserEmail();
        String name = securityConfig.getCurrentUserName();

        // Ensure user exists in database (create if first login)
        User user = userService.ensureUserExists(userId, email, name);

        return Response.ok(UserResponse.from(user)).build();
    }

    @GET
    @Path("/listings")
    public Response getCurrentUserListings() {
        Log.info("GET /me/listings");
        
        String userId = securityConfig.getCurrentUserId();
        List<ListingResponse> listings = listingService.getListingsByUserId(userId)
                .stream()
                .map(ListingResponse::from)
                .toList();

        return Response.ok(listings).build();
    }
}

