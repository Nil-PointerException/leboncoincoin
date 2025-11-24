package com.leboncoincoin.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;

/**
 * Integration tests for Conversation and Message Resources
 * Tests the messaging feature: create listing → create conversation → send messages → mark as read
 */
@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ConversationResourceTest {

    private static String sellerListingId;
    private static String conversationId;
    private static String firstMessageId;
    private static String secondMessageId;

    @Test
    @Order(1)
    @DisplayName("Setup: Create a listing (seller)")
    void testCreateListingAsSeller() {
        String requestBody = """
            {
                "title": "iPhone 13 Pro à vendre",
                "description": "iPhone 13 Pro en excellent état, toujours sous garantie",
                "price": 850.00,
                "category": "Électronique",
                "location": "Paris",
                "imageUrls": []
            }
            """;

        sellerListingId = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/listings")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("id", notNullValue())
                .body("userId", equalTo("test-user-123"))
                .extract().path("id");

        System.out.println("✅ Created seller listing with ID: " + sellerListingId);
    }

    @Test
    @Order(2)
    @DisplayName("Should create a conversation (buyer contacts seller)")
    void testCreateConversation() {
        Assertions.assertNotNull(sellerListingId, "Listing should exist before creating conversation");

        String requestBody = String.format("""
            {
                "listingId": "%s",
                "initialMessage": "Bonjour, je suis intéressé par cet iPhone. Est-il toujours disponible ?"
            }
            """, sellerListingId);

        conversationId = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("id", notNullValue())
                .body("listingId", equalTo(sellerListingId))
                .body("buyerId", equalTo("test-user-123"))
                .body("sellerId", equalTo("test-user-123")) // Same user in test mode
                .body("listing", notNullValue())
                .body("listing.title", equalTo("iPhone 13 Pro à vendre"))
                .extract().path("id");

        System.out.println("✅ Created conversation with ID: " + conversationId);
    }

    @Test
    @Order(3)
    @DisplayName("Should return existing conversation if trying to create duplicate")
    void testCreateDuplicateConversation() {
        Assertions.assertNotNull(sellerListingId, "Listing should exist");

        String requestBody = String.format("""
            {
                "listingId": "%s",
                "initialMessage": "Un autre message"
            }
            """, sellerListingId);

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations")
            .then()
                .statusCode(200) // Returns existing conversation
                .contentType(ContentType.JSON)
                .body("id", equalTo(conversationId));

        System.out.println("✅ Duplicate conversation returns existing one");
    }

    @Test
    @Order(4)
    @DisplayName("Should send first message (buyer)")
    void testSendFirstMessage() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        String requestBody = """
            {
                "content": "Bonjour, est-ce que l'iPhone est toujours disponible ?"
            }
            """;

        firstMessageId = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations/" + conversationId + "/messages")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("id", notNullValue())
                .body("conversationId", equalTo(conversationId))
                .body("senderId", equalTo("test-user-123"))
                .body("content", equalTo("Bonjour, est-ce que l'iPhone est toujours disponible ?"))
                .body("isRead", equalTo(false))
                .body("sentAt", notNullValue())
                .extract().path("id");

        System.out.println("✅ Sent first message with ID: " + firstMessageId);
    }

    @Test
    @Order(5)
    @DisplayName("Should send second message (buyer)")
    void testSendSecondMessage() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        String requestBody = """
            {
                "content": "Je peux venir le chercher ce week-end si ça vous convient."
            }
            """;

        secondMessageId = given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations/" + conversationId + "/messages")
            .then()
                .statusCode(201)
                .contentType(ContentType.JSON)
                .body("id", notNullValue())
                .body("content", equalTo("Je peux venir le chercher ce week-end si ça vous convient."))
                .extract().path("id");

        System.out.println("✅ Sent second message with ID: " + secondMessageId);
    }

    @Test
    @Order(6)
    @DisplayName("Should retrieve all conversations for user")
    void testGetAllConversations() {
        given()
            .when()
                .get("/api/conversations")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("find { it.id == '" + conversationId + "' }.listingId", 
                      equalTo(sellerListingId))
                .body("find { it.id == '" + conversationId + "' }.unreadCount", 
                      greaterThanOrEqualTo(0))
                .body("find { it.id == '" + conversationId + "' }.lastMessage", 
                      notNullValue());

        System.out.println("✅ Retrieved all conversations");
    }

    @Test
    @Order(7)
    @DisplayName("Should retrieve conversation by ID")
    void testGetConversationById() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        given()
            .when()
                .get("/api/conversations/" + conversationId)
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("id", equalTo(conversationId))
                .body("listingId", equalTo(sellerListingId))
                .body("listing.title", equalTo("iPhone 13 Pro à vendre"));

        System.out.println("✅ Retrieved conversation by ID");
    }

    @Test
    @Order(8)
    @DisplayName("Should get all messages in conversation")
    void testGetMessagesInConversation() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        given()
            .when()
                .get("/api/conversations/" + conversationId + "/messages")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("$", hasSize(3)); // Initial message + 2 sent messages

        System.out.println("✅ Retrieved messages in conversation");
    }

    @Test
    @Order(9)
    @DisplayName("Should mark first message as read")
    void testMarkMessageAsRead() {
        Assertions.assertNotNull(firstMessageId, "First message should exist");
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        given()
            .when()
                .put("/api/conversations/" + conversationId + "/messages/" + firstMessageId + "/read")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("id", equalTo(firstMessageId))
                .body("isRead", equalTo(true));

        System.out.println("✅ Marked message as read");
    }

    @Test
    @Order(10)
    @DisplayName("Should verify message is marked as read")
    void testVerifyMessageIsRead() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");
        Assertions.assertNotNull(firstMessageId, "First message should exist");
        Assertions.assertNotNull(secondMessageId, "Second message should exist");

        given()
            .when()
                .get("/api/conversations/" + conversationId + "/messages")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("find { it.id == '" + firstMessageId + "' }.isRead", equalTo(true))
                .body("find { it.id == '" + secondMessageId + "' }.isRead", equalTo(false));

        System.out.println("✅ Verified message read status");
    }

    @Test
    @Order(11)
    @DisplayName("Should return 404 for non-existent conversation")
    void testGetNonExistentConversation() {
        given()
            .when()
                .get("/api/conversations/non-existent-id")
            .then()
                .statusCode(404);

        System.out.println("✅ 404 error handling works for conversations");
    }

    @Test
    @Order(12)
    @DisplayName("Should return 404 for non-existent message")
    void testMarkNonExistentMessageAsRead() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");
        String nonExistentId = java.util.UUID.randomUUID().toString();

        given()
            .when()
                .put("/api/conversations/" + conversationId + "/messages/" + nonExistentId + "/read")
            .then()
                .statusCode(404);

        System.out.println("✅ 404 error handling works for messages");
    }

    @Test
    @Order(13)
    @DisplayName("Should validate empty message content")
    void testSendEmptyMessage() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        String requestBody = """
            {
                "content": ""
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations/" + conversationId + "/messages")
            .then()
                .statusCode(anyOf(equalTo(400), equalTo(422))); // Bad Request or Unprocessable Entity

        System.out.println("✅ Empty message validation works");
    }

    @Test
    @Order(14)
    @DisplayName("Should validate message content is not null")
    void testSendNullMessage() {
        Assertions.assertNotNull(conversationId, "Conversation should exist");

        String requestBody = """
            {
                "content": null
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations/" + conversationId + "/messages")
            .then()
                .statusCode(anyOf(equalTo(400), equalTo(422)));

        System.out.println("✅ Null message validation works");
    }

    @Test
    @Order(15)
    @DisplayName("Should validate conversation creation with non-existent listing")
    void testCreateConversationWithNonExistentListing() {
        String requestBody = """
            {
                "listingId": "non-existent-listing-id"
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
            .when()
                .post("/api/conversations")
            .then()
                .statusCode(anyOf(equalTo(400), equalTo(404)));

        System.out.println("✅ Non-existent listing validation works");
    }

    @Test
    @Order(16)
    @DisplayName("Cleanup: Delete the test listing")
    void testCleanupListing() {
        Assertions.assertNotNull(sellerListingId, "Listing should exist");

        String deleteRequestBody = """
            {
                "reason": "OTHER",
                "wasSold": null
            }
            """;

        given()
            .contentType(ContentType.JSON)
            .body(deleteRequestBody)
            .when()
                .delete("/api/listings/" + sellerListingId)
            .then()
                .statusCode(204);

        System.out.println("✅ Cleaned up test listing (conversation and messages cascade deleted)");
    }

    @Test
    @Order(17)
    @DisplayName("Should verify conversation was cascade deleted with listing")
    void testVerifyConversationDeleted() {
        Assertions.assertNotNull(conversationId, "Conversation ID should be available");

        given()
            .when()
                .get("/api/conversations/" + conversationId)
            .then()
                .statusCode(404);

        System.out.println("✅ Verified conversation was cascade deleted");
    }
}


