package com.leboncoincoin;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;

/**
 * Integration tests for Listing Resource
 * Tests the happy path: create listing → retrieve listing → delete listing
 */
@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ListingResourceTest {

    private static String createdListingId;

    @Test
    @Order(1)
    @DisplayName("Should create a new listing successfully (Happy Path)")
    void testCreateListing() {
        String requestBody = """
            {
                "title": "MacBook Pro 2023",
                "description": "Excellent état, peu utilisé, avec chargeur",
                "price": 1500.00,
                "category": "Électronique",
                "location": "Paris",
                "imageUrls": []
            }
            """;

        createdListingId = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/listings")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("id", notNullValue())
                .body("title", equalTo("MacBook Pro 2023"))
                .body("description", equalTo("Excellent état, peu utilisé, avec chargeur"))
                .body("price", equalTo(1500.00f))
                .body("category", equalTo("Électronique"))
                .body("location", equalTo("Paris"))
                .body("userId", equalTo("test-user-123"))  // Test user from profile
                .body("createdAt", notNullValue())
                .extract().path("id");

        System.out.println("✅ Created listing with ID: " + createdListingId);
    }

    @Test
    @Order(2)
    @DisplayName("Should retrieve the created listing by ID (Happy Path)")
    void testGetListingById() {
        Assertions.assertNotNull(createdListingId, "Listing should have been created in previous test");

        given()
            .when()
                .get("/api/listings/" + createdListingId)
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("id", equalTo(createdListingId))
                .body("title", equalTo("MacBook Pro 2023"))
                .body("description", containsString("Excellent état"))
                .body("price", equalTo(1500.00f))
                .body("category", equalTo("Électronique"))
                .body("location", equalTo("Paris"))
                .body("userId", equalTo("test-user-123"));

        System.out.println("✅ Retrieved listing with ID: " + createdListingId);
    }

    @Test
    @Order(3)
    @DisplayName("Should list all listings including the created one")
    void testGetAllListings() {
        given()
            .when()
                .get("/api/listings")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("find { it.id == '" + createdListingId + "' }.title", 
                      equalTo("MacBook Pro 2023"));

        System.out.println("✅ Listing appears in all listings");
    }

    @Test
    @Order(4)
    @DisplayName("Should filter listings by category")
    void testFilterListingsByCategory() {
        given()
            .queryParam("category", "Électronique")
            .when()
                .get("/api/listings")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].category", equalTo("Électronique"));

        System.out.println("✅ Filter by category works");
    }

    @Test
    @Order(5)
    @DisplayName("Should filter listings by price range")
    void testFilterListingsByPriceRange() {
        given()
            .queryParam("minPrice", 1000)
            .queryParam("maxPrice", 2000)
            .when()
                .get("/api/listings")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("find { it.id == '" + createdListingId + "' }.price", 
                      equalTo(1500.00f));

        System.out.println("✅ Filter by price range works");
    }

    @Test
    @Order(6)
    @DisplayName("Should search listings by keyword")
    void testSearchListings() {
        given()
            .queryParam("search", "MacBook")
            .when()
                .get("/api/listings")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].title", containsString("MacBook"));

        System.out.println("✅ Search by keyword works");
    }

    @Test
    @Order(7)
    @DisplayName("Should retrieve current user's listings")
    void testGetCurrentUserListings() {
        given()
            .when()
                .get("/api/me/listings")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("find { it.id == '" + createdListingId + "' }.userId", 
                      equalTo("test-user-123"));

        System.out.println("✅ Current user listings retrieved");
    }

    @Test
    @Order(8)
    @DisplayName("Should delete the created listing (Happy Path)")
    void testDeleteListing() {
        Assertions.assertNotNull(createdListingId, "Listing should exist before deletion");

        given()
            .when()
                .delete("/api/listings/" + createdListingId)
            .then()
                .statusCode(204);

        // Verify deletion
        given()
            .when()
                .get("/api/listings/" + createdListingId)
            .then()
                .statusCode(404);

        System.out.println("✅ Deleted listing with ID: " + createdListingId);
    }

    @Test
    @Order(9)
    @DisplayName("Should return 404 for non-existent listing")
    void testGetNonExistentListing() {
        given()
            .when()
                .get("/api/listings/non-existent-id")
            .then()
                .statusCode(404);

        System.out.println("✅ 404 error handling works");
    }

    @Test
    @Order(10)
    @DisplayName("Should validate required fields on creation")
    void testCreateListingValidation() {
        String invalidRequestBody = """
            {
                "title": "",
                "description": "Missing title",
                "price": -10.00,
                "category": "",
                "location": "",
                "imageUrls": []
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(invalidRequestBody)
            .when()
                .post("/api/listings")
            .then()
                .statusCode(anyOf(equalTo(400), equalTo(422)));  // Bad Request or Unprocessable Entity

        System.out.println("✅ Validation works");
    }

    @Test
    @DisplayName("Should access health endpoint")
    void testHealthEndpoint() {
        given()
            .when()
                .get("/api/health")
            .then()
                .statusCode(200)
                .body("status", notNullValue());

        System.out.println("✅ Health endpoint works");
    }

    @Test
    @DisplayName("Should create listing with images")
    void testCreateListingWithImages() {
        String requestBody = """
            {
                "title": "iPhone 14 Pro",
                "description": "Comme neuf avec boîte",
                "price": 900.00,
                "category": "Électronique",
                "location": "Lyon",
                "imageUrls": [
                    "http://localhost:9000/lmc-images/test-image-1.jpg",
                    "http://localhost:9000/lmc-images/test-image-2.jpg"
                ]
            }
            """;

        String listingId = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/listings")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("imageUrls", hasSize(2))
                .body("imageUrls[0]", containsString("test-image-1.jpg"))
                .extract().path("id");

        // Cleanup
        given().when().delete("/api/listings/" + listingId);

        System.out.println("✅ Listing with images created successfully");
    }
}

