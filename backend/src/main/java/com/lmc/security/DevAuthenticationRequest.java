package com.lmc.security;

import io.quarkus.security.identity.request.BaseAuthenticationRequest;

/**
 * Authentication request for dev/test mode
 */
public class DevAuthenticationRequest extends BaseAuthenticationRequest {
    
    public DevAuthenticationRequest() {
        // Empty constructor
    }
}

