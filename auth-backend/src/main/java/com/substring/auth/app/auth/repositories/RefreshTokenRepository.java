package com.substring.auth.app.auth.repositories;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.substring.auth.app.auth.entities.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByJti(String jti);

    long countByUser_Id(UUID userId);

    long countByUser_IdAndRevokedFalseAndExpiresAtAfter(UUID userId, Instant now);
}
