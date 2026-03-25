package com.bks.controller;

import com.bks.dto.*;
import com.bks.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/inscription")
    public ResponseEntity<AuthResponse> inscription(@Valid @RequestBody InscriptionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.inscription(request));
    }

    @PostMapping("/connexion")
    public ResponseEntity<AuthResponse> connexion(@Valid @RequestBody ConnexionRequest request) {
        return ResponseEntity.ok(authService.connexion(request));
    }

    @GetMapping("/valider-token")
    public ResponseEntity<Boolean> validerToken(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.validerToken(token.substring(7)));
    }
}