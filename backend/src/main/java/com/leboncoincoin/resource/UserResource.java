package com.leboncoincoin.resource;

import com.leboncoincoin.entity.User;
import com.leboncoincoin.dto.ListingResponse;
import com.leboncoincoin.dto.UserResponse;
import com.leboncoincoin.security.SecurityConfig;
import com.leboncoincoin.service.ListingService;
import com.leboncoincoin.service.UserService;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;

@Path("/me")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserResource {

    @Inject
    UserService userService;

    @Inject
    ListingService listingService;

    @Inject
    SecurityConfig securityConfig;

    @Inject
    JsonWebToken jwt;

    @GET
    public Response getCurrentUser() {
        Log.info("GET /me");
        
        String userId = securityConfig.getCurrentUserId();
        Object emailObj = jwt.getClaim("email");
        String email = (emailObj != null) ? emailObj.toString() : null;
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
        Object emailObj = jwt.getClaim("email");
        String email = (emailObj != null) ? emailObj.toString() : null;
        String name = securityConfig.getCurrentUserName();

        // Auto-provision user on first contact even if no prior DB record exists
        userService.ensureUserExists(userId, email, name);

        List<ListingResponse> listings = listingService.getListingsByUserId(userId)
                .stream()
                .map(ListingResponse::from)
                .toList();

        return Response.ok(listings).build();
    }
}

