package com.lmc.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
class ListingResourceTest {

    @Test
    void testGetAllListings() {
        given()
            .when().get("/api/listings")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON);
    }

    @Test
    void testHealthEndpoint() {
        given()
            .when().get("/api/health")
            .then()
                .statusCode(200)
                .body("status", notNullValue());
    }
}

