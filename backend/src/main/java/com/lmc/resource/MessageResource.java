package com.lmc.resource;

import com.lmc.dto.MessageResponse;
import com.lmc.dto.SendMessageRequest;
import com.lmc.entity.Conversation;
import com.lmc.entity.Message;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/conversations/{conversationId}/messages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class MessageResource {

    @Inject
    SecurityIdentity securityIdentity;

    @GET
    public Response getMessages(@PathParam("conversationId") String conversationId) {
        String userId = securityIdentity.getPrincipal().getName();
        
        Conversation conversation = Conversation.findById(conversationId);
        if (conversation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        // Check if user is part of the conversation
        if (!conversation.buyerId.equals(userId) && !conversation.sellerId.equals(userId)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Message> messages = Message.findByConversationId(conversationId);
        return Response.ok(messages.stream().map(MessageResponse::from).toList()).build();
    }

    @POST
    @Transactional
    public Response sendMessage(
        @PathParam("conversationId") String conversationId,
        @Valid SendMessageRequest request
    ) {
        String userId = securityIdentity.getPrincipal().getName();
        
        Conversation conversation = Conversation.findById(conversationId);
        if (conversation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        // Check if user is part of the conversation
        if (!conversation.buyerId.equals(userId) && !conversation.sellerId.equals(userId)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        // Create message
        Message message = new Message();
        message.conversation = conversation;
        message.senderId = userId;
        message.content = request.content();
        message.isRead = false;
        message.persist();
        
        // Update conversation's updatedAt
        conversation.preUpdate();
        conversation.persist();
        
        return Response.status(Response.Status.CREATED)
            .entity(MessageResponse.from(message))
            .build();
    }

    @PUT
    @Path("/{messageId}/read")
    @Transactional
    public Response markAsRead(
        @PathParam("conversationId") String conversationId,
        @PathParam("messageId") String messageId
    ) {
        String userId = securityIdentity.getPrincipal().getName();
        
        Message message = Message.findById(messageId);
        if (message == null || !message.conversation.id.equals(conversationId)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        // Only the recipient can mark as read
        if (message.senderId.equals(userId)) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("Vous ne pouvez pas marquer vos propres messages comme lus")
                .build();
        }
        
        message.isRead = true;
        message.persist();
        
        return Response.ok(MessageResponse.from(message)).build();
    }

    @PUT
    @Path("/mark-all-read")
    @Transactional
    public Response markAllAsRead(@PathParam("conversationId") String conversationId) {
        String userId = securityIdentity.getPrincipal().getName();
        
        Conversation conversation = Conversation.findById(conversationId);
        if (conversation == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        // Check if user is part of the conversation
        if (!conversation.buyerId.equals(userId) && !conversation.sellerId.equals(userId)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Message> messages = Message.findByConversationId(conversationId);
        messages.stream()
            .filter(m -> !m.senderId.equals(userId) && !m.isRead)
            .forEach(m -> {
                m.isRead = true;
                m.persist();
            });
        
        return Response.ok().build();
    }
}

