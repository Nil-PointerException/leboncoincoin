package com.lmc.security;

import io.quarkus.arc.profile.IfBuildProfile;
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.IdentityProvider;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.security.Principal;

/**
 * Identity Provider for Dev/Test Mode
 * Creates a test user identity when auth is disabled
 * ONLY ACTIVE IN DEV AND TEST PROFILES
 */
@ApplicationScoped
@IfBuildProfile(anyOf = {"dev", "test"})
@Priority(1)
public class DevIdentityProvider implements IdentityProvider<DevAuthenticationRequest> {

    @ConfigProperty(name = "app.dev.test-user-id", defaultValue = "dev-user-123")
    String testUserId;

    @ConfigProperty(name = "app.dev.test-user-email", defaultValue = "dev@lmc.local")
    String testUserEmail;

    @ConfigProperty(name = "app.dev.test-user-name", defaultValue = "Dev User")
    String testUserName;

    @Override
    public Class<DevAuthenticationRequest> getRequestType() {
        return DevAuthenticationRequest.class;
    }

    @Override
    public Uni<SecurityIdentity> authenticate(DevAuthenticationRequest request, AuthenticationRequestContext context) {
        // Create test user identity
        QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder()
                .setPrincipal(new Principal() {
                    @Override
                    public String getName() {
                        return testUserId;
                    }
                })
                .addRole("user")
                .addRole("authenticated")
                .addAttribute("email", testUserEmail)
                .addAttribute("name", testUserName);

        SecurityIdentity identity = builder.build();
        
        return Uni.createFrom().item(identity);
    }
}

