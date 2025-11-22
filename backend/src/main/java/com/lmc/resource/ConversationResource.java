package com.lmc.resource;

import com.lmc.dto.ConversationResponse;
import com.lmc.dto.CreateConversationRequest;
import com.lmc.dto.MessageResponse;
import com.lmc.entity.Conversation;
import com.lmc.entity.Listing;
import com.lmc.entity.Message;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Comparator;
import java.util.List;

@Path("/conversations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class ConversationResource {

    @Inject
    SecurityIdentity securityIdentity;

    @GET
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
                
                return ConversationResponse.from(conversation, lastMessage, unreadCount);
            })
            .sorted(Comparator.comparing(ConversationResponse::updatedAt).reversed())
            .toList();
    }

    @GET
    @Path("/{id}")
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
        
        return Response.ok(ConversationResponse.from(conversation, lastMessage, unreadCount)).build();
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
        
        // Prevent user from messaging themselves
        if (buyerId.equals(sellerId)) {
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
            
            return Response.ok(ConversationResponse.from(existing, lastMessage, 0)).build();
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
        
        return Response.status(Response.Status.CREATED)
            .entity(ConversationResponse.from(conversation, lastMessage, 0))
            .build();
    }

    @GET
    @Path("/listing/{listingId}")
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
                
                return ConversationResponse.from(conversation, lastMessage, unreadCount);
            })
            .toList();
    }
}

