package com.leboncoincoin.resource;

import com.leboncoincoin.dto.ContactRequest;
import com.leboncoincoin.dto.EmailRequest;
import com.leboncoincoin.security.SecurityConfig;
import com.leboncoincoin.service.EmailService;
import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Map;
import java.util.Optional;

@Path("/contact")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@PermitAll
public class ContactResource {

    @Inject
    EmailService emailService;

    @Inject
    SecurityConfig securityConfig;

    @ConfigProperty(name = "app.email.contact-recipient")
    Optional<String> contactRecipient;

    @ConfigProperty(name = "app.email.from")
    Optional<String> fromEmail;

    @ConfigProperty(name = "app.email.from-name")
    Optional<String> fromName;

    private static final Map<String, String> REASON_LABELS = Map.of(
        "QUESTION", "Question générale",
        "BUG_REPORT", "Signaler un bug",
        "FEATURE_REQUEST", "Demande de fonctionnalité",
        "ACCOUNT_ISSUE", "Problème de compte",
        "OTHER", "Autre"
    );

    @POST
    public Response contact(@Valid ContactRequest request) {
        Log.infof("Contact form submitted: reason=%s, message length=%d", 
            request.reason(), request.message().length());

        try {
            // Get user info if authenticated
            String userEmail = null;
            String userName = "Utilisateur anonyme";
            String userId = null;

            try {
                if (securityConfig.isAuthenticated()) {
                    userId = securityConfig.getCurrentUserId();
                    userEmail = securityConfig.getCurrentUserEmail();
                    userName = securityConfig.getCurrentUserName();
                }
            } catch (Exception e) {
                Log.debugf("User not authenticated, sending as anonymous: %s", e.getMessage());
            }

            // Determine recipient email
            String recipient = contactRecipient.orElse(
                fromEmail.orElse("contact@leboncoincoin.com")
            );

            // Build email content
            String subject = String.format("[Contact] %s - %s", 
                REASON_LABELS.getOrDefault(request.reason(), request.reason()),
                userName);

            String htmlContent = generateContactEmailTemplate(
                request.reason(),
                request.message(),
                userName,
                userEmail,
                userId
            );

            // Send email directly with HTML content
            String provider = emailService.getEmailProvider();
            if ("ses".equalsIgnoreCase(provider)) {
                emailService.sendWithSES(recipient, subject, htmlContent);
            } else {
                emailService.sendWithSMTP(recipient, subject, htmlContent);
            }

            Log.infof("Contact email sent successfully to %s", recipient);

            return Response.ok(Map.of(
                "success", true,
                "message", "Votre message a été envoyé avec succès. Nous vous répondrons bientôt."
            )).build();

        } catch (Exception e) {
            Log.errorf(e, "Failed to send contact email");
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of(
                    "success", false,
                    "message", "Erreur lors de l'envoi du message. Veuillez réessayer plus tard."
                ))
                .build();
        }
    }

    private String generateContactEmailTemplate(
        String reason,
        String message,
        String userName,
        String userEmail,
        String userId
    ) {
        String reasonLabel = REASON_LABELS.getOrDefault(reason, reason);
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #FFD700 0%%, #FF9500 100%%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .info-box {
                        background: white;
                        padding: 15px;
                        border-left: 4px solid #FFD700;
                        margin: 15px 0;
                    }
                    .message-box {
                        background: white;
                        padding: 20px;
                        border-radius: 5px;
                        margin: 20px 0;
                        white-space: pre-wrap;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🦆 Nouveau message de contact</h1>
                </div>
                <div class="content">
                    <div class="info-box">
                        <strong>Raison :</strong> %s<br>
                        <strong>Utilisateur :</strong> %s<br>
                        <strong>Email :</strong> %s<br>
                        <strong>ID Utilisateur :</strong> %s
                    </div>
                    
                    <h3>Message :</h3>
                    <div class="message-box">
                        %s
                    </div>
                </div>
                <div class="footer">
                    <p>© 2024 LeBonCoinCoin - Message de contact</p>
                </div>
            </body>
            </html>
            """, 
            reasonLabel,
            userName,
            userEmail != null ? userEmail : "Non connecté",
            userId != null ? userId : "Anonyme",
            escapeHtml(message)
        );
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}

