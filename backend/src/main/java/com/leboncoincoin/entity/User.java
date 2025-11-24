package com.leboncoincoin.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @Column(name = "id", nullable = false, length = 255)
    public String id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    public String email;

    @Column(name = "name", nullable = false, length = 255)
    public String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    public UserRole role = UserRole.USER;

    @Column(name = "created_at", nullable = false)
    public Instant createdAt;

    public User() {
    }

    public User(String id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = UserRole.USER;
        this.createdAt = Instant.now();
    }

    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
                '}';
    }
}

