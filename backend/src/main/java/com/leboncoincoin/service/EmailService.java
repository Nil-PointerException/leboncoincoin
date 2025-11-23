package com.leboncoincoin.service;

import com.leboncoincoin.dto.EmailRequest;
import io.quarkus.logging.Log;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.qute.Template;
import io.quarkus.qute.Location;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class EmailService {

    @ConfigProperty(name = "app.email.provider")
    Optional<String> emailProvider; // "smtp" for dev (MailHog), "ses" for prod

    @ConfigProperty(name = "app.email.from")
    Optional<String> fromEmail;

    @ConfigProperty(name = "app.email.from-name")
    Optional<String> fromName;

    @Inject
    Instance<Mailer> mailer; // For SMTP (MailHog in dev)

    @Inject
    Instance<SesClient> sesClient; // For AWS SES in production

    /**
     * Send an email using the configured provider (SMTP for dev, SES for prod)
     */
    public void sendEmail(EmailRequest emailRequest) {
        String provider = emailProvider.orElse("smtp");
        Log.infof("Sending email to %s with subject: %s using provider: %s", 
                emailRequest.to(), emailRequest.subject(), provider);

        try {
            String htmlContent = renderTemplate(emailRequest.templateName(), emailRequest.templateData());

            if ("ses".equalsIgnoreCase(provider)) {
                sendWithSES(emailRequest.to(), emailRequest.subject(), htmlContent);
            } else {
                sendWithSMTP(emailRequest.to(), emailRequest.subject(), htmlContent);
            }

            Log.infof("Email sent successfully to %s", emailRequest.to());
        } catch (Exception e) {
            Log.errorf(e, "Failed to send email to %s", emailRequest.to());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    /**
     * Send welcome email to new user
     */
    public void sendWelcomeEmail(String userEmail, String userName) {
        Log.infof("Sending welcome email to %s (%s)", userName, userEmail);

        Map<String, Object> data = Map.of(
            "userName", userName,
            "appName", "LMC Annonces"
        );

        EmailRequest request = EmailRequest.of(
            userEmail,
            "Bienvenue sur LMC Annonces ! 🎉",
            "welcome",
            data
        );

        sendEmail(request);
    }

    /**
     * Send email via SMTP (MailHog in dev mode)
     */
    private void sendWithSMTP(String to, String subject, String htmlContent) {
        Log.debugf("Sending email via SMTP to %s", to);

        if (mailer.isUnsatisfied()) {
            Log.warnf("Mailer not available, skipping SMTP email to %s", to);
            return;
        }

        String from = String.format("%s <%s>", 
                fromName.orElse("LMC Annonces"), 
                fromEmail.orElse("noreply@lmc.local"));
        
        Mail mail = Mail.withHtml(to, subject, htmlContent)
                .setFrom(from);

        mailer.get().send(mail);
    }

    /**
     * Send email via AWS SES (production)
     */
    private void sendWithSES(String to, String subject, String htmlContent) {
        Log.debugf("Sending email via AWS SES to %s", to);

        if (sesClient.isUnsatisfied()) {
            Log.warnf("SesClient not available, skipping SES email to %s", to);
            return;
        }

        Destination destination = Destination.builder()
                .toAddresses(to)
                .build();

        Content subjectContent = Content.builder()
                .data(subject)
                .build();

        Content htmlBody = Content.builder()
                .data(htmlContent)
                .build();

        Body body = Body.builder()
                .html(htmlBody)
                .build();

        Message message = Message.builder()
                .subject(subjectContent)
                .body(body)
                .build();

        String source = String.format("%s <%s>", 
                fromName.orElse("LMC Annonces"), 
                fromEmail.orElse("noreply@lmc.local"));

        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .source(source)
                .destination(destination)
                .message(message)
                .build();

        sesClient.get().sendEmail(emailRequest);
    }

    /**
     * Render Qute template with data
     */
    private String renderTemplate(String templateName, Map<String, Object> data) {
        // For now, return a simple HTML template
        // In a real implementation, you would use Qute to render templates
        return generateSimpleTemplate(templateName, data);
    }

    /**
     * Generate a simple HTML template (fallback)
     * In production, use Qute templates
     */
    private String generateSimpleTemplate(String templateName, Map<String, Object> data) {
        if ("welcome".equals(templateName)) {
            String userName = (String) data.getOrDefault("userName", "Utilisateur");
            String appName = (String) data.getOrDefault("appName", "LMC Annonces");

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
                            background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
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
                        .button {
                            display: inline-block;
                            background: #667eea;
                            color: white;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
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
                        <h1>🎉 Bienvenue sur %s !</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour %s,</h2>
                        <p>Nous sommes ravis de vous accueillir sur notre plateforme de petites annonces !</p>
                        <p>Avec %s, vous pouvez :</p>
                        <ul>
                            <li>📝 Publier des annonces gratuitement</li>
                            <li>🔍 Rechercher des articles près de chez vous</li>
                            <li>💬 Contacter directement les vendeurs</li>
                            <li>⭐ Sauvegarder vos annonces favorites</li>
                        </ul>
                        <p>N'hésitez pas à explorer la plateforme et à publier votre première annonce !</p>
                        <p style="text-align: center;">
                            <a href="http://localhost:5173" class="button">Commencer à explorer</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2024 %s - Tous droits réservés</p>
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                    </div>
                </body>
                </html>
                """, appName, userName, appName, appName);
        }

        return "<html><body><h1>Email Template</h1></body></html>";
    }
}

