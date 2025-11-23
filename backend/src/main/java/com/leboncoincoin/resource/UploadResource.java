package com.leboncoincoin.resource;

import com.leboncoincoin.dto.PresignedUrlRequest;
import com.leboncoincoin.dto.PresignedUrlResponse;
import com.leboncoincoin.security.SecurityConfig;
import com.leboncoincoin.service.S3Service;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/uploads")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class UploadResource {

    @Inject
    S3Service s3Service;

    @Inject
    SecurityConfig securityConfig;

    @POST
    @Path("/presigned-url")
    public Response generatePresignedUrl(@Valid PresignedUrlRequest request) {
        Log.infof("POST /uploads/presigned-url - filename: %s, contentType: %s", 
                request.filename(), request.contentType());
        
        String userId = securityConfig.getCurrentUserId();
        PresignedUrlResponse response = s3Service.generatePresignedUploadUrl(
                request.filename(), 
                request.contentType(), 
                userId
        );

        return Response.ok(response).build();
    }
}

