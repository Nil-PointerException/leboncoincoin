package com.lmc.security;

import io.quarkus.arc.profile.IfBuildProfile;
import io.quarkus.security.identity.IdentityProviderManager;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.request.AuthenticationRequest;
import io.quarkus.vertx.http.runtime.security.ChallengeData;
import io.quarkus.vertx.http.runtime.security.HttpAuthenticationMechanism;
import io.quarkus.vertx.http.runtime.security.HttpCredentialTransport;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.web.RoutingContext;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Collections;
import java.util.Set;

/**
 * Custom Authentication Mechanism for Dev/Test Mode
 * Bypasses JWT authentication and provides a test user identity
 * ONLY ACTIVE IN DEV AND TEST PROFILES
 */
@ApplicationScoped
@IfBuildProfile(anyOf = {"dev", "test"})
@Priority(1)
public class DevAuthenticationMechanism implements HttpAuthenticationMechanism {

    @ConfigProperty(name = "app.dev.auth-enabled", defaultValue = "false")
    boolean authEnabled;

    @Override
    public Uni<SecurityIdentity> authenticate(RoutingContext context, IdentityProviderManager identityProviderManager) {
        // If auth is enabled, skip this mechanism (let OIDC handle it)
        if (authEnabled) {
            return Uni.createFrom().nullItem();
        }

        // Create a dev authentication request
        DevAuthenticationRequest authRequest = new DevAuthenticationRequest();
        return identityProviderManager.authenticate(authRequest);
    }

    @Override
    public Uni<ChallengeData> getChallenge(RoutingContext context) {
        // No challenge needed in dev mode
        return Uni.createFrom().nullItem();
    }

    @Override
    public Set<Class<? extends AuthenticationRequest>> getCredentialTypes() {
        return Collections.singleton(DevAuthenticationRequest.class);
    }

    @Override
    public Uni<HttpCredentialTransport> getCredentialTransport(RoutingContext context) {
        // Return null to indicate this mechanism doesn't use HTTP transport
        return Uni.createFrom().nullItem();
    }
}

