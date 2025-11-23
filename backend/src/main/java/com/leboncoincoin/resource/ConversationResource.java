package com.leboncoincoin.resource;

import com.leboncoincoin.dto.ConversationResponse;
import com.leboncoincoin.dto.CreateConversationRequest;
import com.leboncoincoin.dto.ListingResponse;
import com.leboncoincoin.dto.MessageResponse;
import com.leboncoincoin.entity.Conversation;
import com.leboncoincoin.entity.Listing;
import com.leboncoincoin.entity.Message;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Path("/conversations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class ConversationResource {

    @Inject
    SecurityIdentity securityIdentity;

    @ConfigProperty(name = "app.messaging.allow-self-messaging", defaultValue = "false")
    boolean allowSelfMessaging;

    @GET
    @Transactional
    public List<ConversationResponse> getUserConversations() {
        String userId = securityIdentity.getPrincipal().getName();
        List<Conversation> conversations = Conversation.findByUserId(userId);
        
        return conversations.stream()
            .map(conversation -> {
                List<Message> messages = Message.findByConversationId(conversation.id);
                MessageResponse lastMessage = messages.isEmpty() 
                    ? null 
                    : MessageResponse.from(messages.get(messages.size() - 1));
                
                // Count unread messages for the current user
                int unreadCount = (int) messages.stream()
                    .filter(m -> !m.senderId.equals(userId) && !m.isRead)
                    .count();
                
                // Fetch listing
                Listing listing = Listing.findById(conversation.listingId);
                ListingResponse listingResponse = listing != null ? ListingResponse.from(listing) : null;
                
                return ConversationResponse.from(conversation, lastMessage, unreadCount, listingResponse);
            })
            .sorted(Comparator.comparing(ConversationResponse::updatedAt).reversed())
            .toList();
    }

    @GET
    @Path("/{id}")
    @Transactional
    public Response getConversation(@PathParam("id") String id) {
        String userId = securityIdentity.getPrincipal().getName();
        Conversation conversation = Conversation.findById(id);
        
        if (conversation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        // Check if user is part of the conversation
        if (!conversation.buyerId.equals(userId) && !conversation.sellerId.equals(userId)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Message> messages = Message.findByConversationId(conversation.id);
        MessageResponse lastMessage = messages.isEmpty() 
            ? null 
            : MessageResponse.from(messages.get(messages.size() - 1));
        
        int unreadCount = (int) messages.stream()
            .filter(m -> !m.senderId.equals(userId) && !m.isRead)
            .count();
        
        // Fetch listing
        Listing listing = Listing.findById(conversation.listingId);
        ListingResponse listingResponse = listing != null ? ListingResponse.from(listing) : null;
        
        return Response.ok(ConversationResponse.from(conversation, lastMessage, unreadCount, listingResponse)).build();
    }

    @POST
    @Transactional
    public Response createConversation(@Valid CreateConversationRequest request) {
        String buyerId = securityIdentity.getPrincipal().getName();
        
        // Get listing
        Listing listing = Listing.findById(request.listingId());
        if (listing == null) {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("Annonce non trouvée")
                .build();
        }
        
        String sellerId = listing.userId;
        
        // Prevent user from messaging themselves (unless in test mode)
        if (buyerId.equals(sellerId) && !allowSelfMessaging) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("Vous ne pouvez pas vous envoyer un message à vous-même")
                .build();
        }
        
        // Check if conversation already exists
        Conversation existing = Conversation.findByListingAndUsers(request.listingId(), buyerId, sellerId);
        if (existing != null) {
            // Return existing conversation
            List<Message> messages = Message.findByConversationId(existing.id);
            MessageResponse lastMessage = messages.isEmpty() 
                ? null 
                : MessageResponse.from(messages.get(messages.size() - 1));
            
            ListingResponse listingResponse = ListingResponse.from(listing);
            
            return Response.ok(ConversationResponse.from(existing, lastMessage, 0, listingResponse)).build();
        }
        
        // Create new conversation
        Conversation conversation = new Conversation();
        conversation.listingId = request.listingId();
        conversation.buyerId = buyerId;
        conversation.sellerId = sellerId;
        conversation.persist();
        
        // Create initial message
        Message message = new Message();
        message.conversation = conversation;
        message.senderId = buyerId;
        message.content = request.initialMessage();
        message.persist();
        
        MessageResponse lastMessage = MessageResponse.from(message);
        ListingResponse listingResponse = ListingResponse.from(listing);
        
        return Response.status(Response.Status.CREATED)
            .entity(ConversationResponse.from(conversation, lastMessage, 0, listingResponse))
            .build();
    }

    @GET
    @Path("/listing/{listingId}")
    @Transactional
    public List<ConversationResponse> getConversationsByListing(@PathParam("listingId") String listingId) {
        String userId = securityIdentity.getPrincipal().getName();
        
        // Get listing to check ownership
        Listing listing = Listing.findById(listingId);
        if (listing == null) {
            throw new NotFoundException("Annonce non trouvée");
        }
        
        // Only listing owner can see all conversations
        if (!listing.userId.equals(userId)) {
            throw new ForbiddenException("Accès refusé");
        }
        
        List<Conversation> conversations = Conversation.findByListingId(listingId);
        
        return conversations.stream()
            .map(conversation -> {
                List<Message> messages = Message.findByConversationId(conversation.id);
                MessageResponse lastMessage = messages.isEmpty() 
                    ? null 
                    : MessageResponse.from(messages.get(messages.size() - 1));
                
                int unreadCount = (int) messages.stream()
                    .filter(m -> !m.senderId.equals(userId) && !m.isRead)
                    .count();
                
                // Fetch listing (reuse the one we already fetched)
                ListingResponse listingResponse = ListingResponse.from(listing);
                
                return ConversationResponse.from(conversation, lastMessage, unreadCount, listingResponse);
            })
            .toList();
    }
}

