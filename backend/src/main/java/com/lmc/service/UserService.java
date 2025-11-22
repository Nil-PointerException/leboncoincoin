package com.lmc.service;

import com.lmc.entity.User;
import com.lmc.repository.UserRepository;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Optional;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

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
        
        User newUser = new User(id, email, name);
        userRepository.persist(newUser);
        return newUser;
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
