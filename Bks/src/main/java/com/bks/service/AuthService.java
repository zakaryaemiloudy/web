package com.bks.service;

import com.bks.dto.AuthResponse;
import com.bks.dto.ConnexionRequest;
import com.bks.dto.InscriptionRequest;
import com.bks.enums.Role;
import com.bks.model.Hopital;
import com.bks.model.Utilisateur;
import com.bks.repository.HopitalRepository;
import com.bks.repository.UtilisateurRepository;
import com.bks.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse inscription(InscriptionRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setRole(request.getRole());
        utilisateur.setActif(true);
        utilisateur.setDateCreation(LocalDateTime.now());

        if (request.getRole() == Role.ADMIN) {
            if (request.getHopitalId() == null) {
                throw new RuntimeException("L'ID de l'hôpital est requis pour un administrateur");
            }
            Hopital hopital = hopitalRepository.findById(request.getHopitalId())
                    .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));
            utilisateur.setHopital(hopital);
        }

        utilisateur = utilisateurRepository.save(utilisateur);

        // Set default role toggle values for new users
        utilisateur.setIsDonneurActif(true);
        utilisateur.setIsPatientActif(false);
        utilisateur.setPointsTotal(0);
        utilisateur = utilisateurRepository.save(utilisateur);

        String token = jwtUtil.generateToken(
                utilisateur.getEmail(),
                utilisateur.getId(),
                utilisateur.getRole().name()
        );

        String hopitalNom = utilisateur.getHopital() != null ? utilisateur.getHopital().getNom() : null;
        Long hopitalId = utilisateur.getHopital() != null ? utilisateur.getHopital().getId() : null;

        return new AuthResponse(
                token,
                utilisateur.getId(),
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole(),
                hopitalId,
                hopitalNom,
                utilisateur.getActif(),
                utilisateur.getIsDonneurActif(),
                utilisateur.getIsPatientActif(),
                utilisateur.getPointsTotal()
        );
    }

    @Transactional
    public AuthResponse connexion(ConnexionRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getMotDePasse()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        } catch (DisabledException e) {
            throw new RuntimeException("Compte désactivé");
        }

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateur.setDerniereConnexion(LocalDateTime.now());
        utilisateurRepository.save(utilisateur);

        String token = jwtUtil.generateToken(
                utilisateur.getEmail(),
                utilisateur.getId(),
                utilisateur.getRole().name()
        );

        String hopitalNom = utilisateur.getHopital() != null ? utilisateur.getHopital().getNom() : null;
        Long hopitalId = utilisateur.getHopital() != null ? utilisateur.getHopital().getId() : null;

        return new AuthResponse(
                token,
                utilisateur.getId(),
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole(),
                hopitalId,
                hopitalNom,
                utilisateur.getActif(),
                utilisateur.getIsDonneurActif(),
                utilisateur.getIsPatientActif(),
                utilisateur.getPointsTotal()
        );
    }

    public Boolean validerToken(String token) {
        try {
            String email = jwtUtil.extractEmail(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            return jwtUtil.validateToken(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }
}