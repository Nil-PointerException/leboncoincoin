package com.leboncoincoin.security;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Security configuration and helper utilities
 * Provides methods to extract user information from JWT tokens or dev identity
 */
@ApplicationScoped
public class SecurityConfig {

    @Inject
    SecurityIdentity securityIdentity;

    /**
     * Get the current authenticated user ID from JWT subject claim or dev identity
     */
    public String getCurrentUserId() {
        if (securityIdentity.isAnonymous()) {
            throw new SecurityException("User is not authenticated");
        }
        return securityIdentity.getPrincipal().getName();
    }

    /**
     * Get a specific claim from the JWT token or dev identity attributes
     */
    public String getClaim(String claimName) {
        return securityIdentity.getAttribute(claimName);
    }

    /**
     * Get user email from JWT token or dev identity (email attribute)
     */
    public String getCurrentUserEmail() {
        String email = getClaim("email");
        if (email == null) {
            throw new SecurityException("Email claim not found in token");
        }
        return email;
    }

    /**
     * Get user name from JWT token or dev identity (name attribute)
     */
    public String getCurrentUserName() {
        String name = getClaim("name");
        return name != null ? name : "Unknown User";
    }

    /**
     * Check if current user is authenticated
     */
    public boolean isAuthenticated() {
        return !securityIdentity.isAnonymous();
    }
}

