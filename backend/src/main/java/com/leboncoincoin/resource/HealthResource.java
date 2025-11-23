package com.leboncoincoin.resource;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;
import java.util.Map;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
@PermitAll
public class HealthResource {

    @GET
    public Response health() {
        return Response.ok(Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "service", "lmc-backend"
        )).build();
    }
}

