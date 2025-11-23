package com.leboncoincoin.service;

import com.leboncoincoin.entity.User;
import com.leboncoincoin.repository.UserRepository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Optional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    @Inject
    Instance<EmailService> emailService;

    @ConfigProperty(name = "app.email.welcome-enabled")
    Optional<Boolean> welcomeEmailEnabled;

    @Transactional
    public User createOrUpdateUser(String id, String email, String name) {
        Log.infof("Creating or updating user: id=%s, email=%s", id, email);
        
        Optional<User> existingUser = userRepository.findByIdOptional(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.email = email;
            user.name = name;
            userRepository.persist(user);
            return user;
        }
        
        // New user - create and send welcome email
        User newUser = new User(id, email, name);
        userRepository.persist(newUser);
        
        // Send welcome email asynchronously (don't block user creation if email fails)
        sendWelcomeEmailAsync(newUser);
        
        return newUser;
    }

    /**
     * Send welcome email asynchronously to avoid blocking user creation
     */
    private void sendWelcomeEmailAsync(User user) {
        if (!welcomeEmailEnabled.orElse(true)) {
            Log.debugf("Welcome email disabled, skipping for user: %s", user.email);
            return;
        }

        // Check if EmailService is available (may not be in test mode)
        if (emailService.isUnsatisfied()) {
            Log.debugf("EmailService not available, skipping welcome email for user: %s", user.email);
            return;
        }

        try {
            Log.infof("Sending welcome email to new user: %s (%s)", user.name, user.email);
            emailService.get().sendWelcomeEmail(user.email, user.name);
        } catch (Exception e) {
            // Log error but don't fail user creation
            Log.errorf(e, "Failed to send welcome email to user: %s", user.email);
        }
    }

    public Optional<User> getUserById(String id) {
        Log.debugf("Getting user by id: %s", id);
        return userRepository.findByIdOptional(id);
    }

    public Optional<User> getUserByEmail(String email) {
        Log.debugf("Getting user by email: %s", email);
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User ensureUserExists(String id, String email, String name) {
        return createOrUpdateUser(id, email, name);
    }
}
