package com.leboncoincoin.resource;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
@PermitAll
public class HealthResource {

    @Inject
    EntityManager entityManager;

    @GET
    public Response health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now().toString());
        health.put("service", "leboncoincoin-backend");
        
        // Check database connectivity
        try {
            entityManager.createNativeQuery("SELECT 1").getSingleResult();
            health.put("database", "UP");
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("database", "DOWN");
            health.put("error", e.getMessage());
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(health).build();
        }
        
        return Response.ok(health).build();
    }
}

