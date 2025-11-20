package com.lmc.exception;

import io.quarkus.logging.Log;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.stream.Collectors;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Context
    UriInfo uriInfo;

    @Override
    public Response toResponse(Exception exception) {
        Log.error("Exception caught in global handler", exception);

        return switch (exception) {
            case ResourceNotFoundException e -> handleResourceNotFound(e);
            case SecurityException e -> handleSecurityException(e);
            case ConstraintViolationException e -> handleValidationException(e);
            case IllegalArgumentException e -> handleBadRequest(e);
            default -> handleGenericException(exception);
        };
    }

    private Response handleResourceNotFound(ResourceNotFoundException e) {
        ErrorResponse error = new ErrorResponse(
                404,
                "Not Found",
                e.getMessage(),
                getPath()
        );
        return Response.status(Response.Status.NOT_FOUND).entity(error).build();
    }

    private Response handleSecurityException(SecurityException e) {
        ErrorResponse error = new ErrorResponse(
                403,
                "Forbidden",
                e.getMessage(),
                getPath()
        );
        return Response.status(Response.Status.FORBIDDEN).entity(error).build();
    }

    private Response handleValidationException(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        
        ErrorResponse error = new ErrorResponse(
                400,
                "Bad Request",
                "Validation failed: " + message,
                getPath()
        );
        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }

    private Response handleBadRequest(IllegalArgumentException e) {
        ErrorResponse error = new ErrorResponse(
                400,
                "Bad Request",
                e.getMessage(),
                getPath()
        );
        return Response.status(Response.Status.BAD_REQUEST).entity(error).build();
    }

    private Response handleGenericException(Exception e) {
        ErrorResponse error = new ErrorResponse(
                500,
                "Internal Server Error",
                "An unexpected error occurred: " + e.getMessage(),
                getPath()
        );
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error).build();
    }

    private String getPath() {
        return uriInfo != null ? uriInfo.getPath() : "unknown";
    }
}

