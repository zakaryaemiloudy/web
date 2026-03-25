package com.bks.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bks.dto.CampagneRequest;
import com.bks.dto.CampagneResponse;
import com.bks.dto.DashboardAnalytics;
import com.bks.dto.HopitalRequest;
import com.bks.dto.HopitalResponse;
import com.bks.dto.NotificationRequest;
import com.bks.dto.StatistiquesGlobales;
import com.bks.enums.Role;
import com.bks.enums.StatutHopital;
import com.bks.model.Hopital;
import com.bks.model.Utilisateur;
import com.bks.repository.HopitalRepository;
import com.bks.repository.UtilisateurRepository;
import com.bks.service.CampagneService;
import com.bks.service.DashboardService;
import com.bks.service.NotificationService;
import com.bks.service.SuperAdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    @Autowired
    private SuperAdminService superAdminService;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CampagneService campagneService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // ===== GESTION HÔPITAUX =====

    @PostMapping("/hopitaux")
    public ResponseEntity<HopitalResponse> creerHopital(@Valid @RequestBody HopitalRequest request) {
        Hopital hopital = new Hopital();
        hopital.setNom(request.getNom());
        hopital.setAdresse(request.getAdresse());
        hopital.setVille(request.getVille());
        hopital.setRegion(request.getRegion());
        hopital.setTelephone(request.getTelephone());
        hopital.setEmail(request.getEmail());
        hopital.setCapaciteStockage(request.getCapaciteStockage());
        hopital.setDescription(request.getDescription());
        hopital.setStatut(StatutHopital.EN_ATTENTE);

        hopital = hopitalRepository.save(hopital);

        HopitalResponse response = new HopitalResponse();
        response.setId(hopital.getId());
        response.setNom(hopital.getNom());
        response.setStatut(hopital.getStatut());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/hopitaux")
    public ResponseEntity<List<Hopital>> getTousHopitaux() {
        return ResponseEntity.ok(hopitalRepository.findAll());
    }

    @GetMapping("/hopitaux/en-attente")
    public ResponseEntity<List<HopitalResponse>> getHopitauxEnAttente() {
        return ResponseEntity.ok(superAdminService.getHopitauxEnAttente());
    }

    @PutMapping("/hopitaux/{id}/valider")
    public ResponseEntity<HopitalResponse> validerHopital(
            @PathVariable Long id,
            Authentication auth) {
        String email = auth.getName();
        Utilisateur admin = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(superAdminService.validerHopital(id, admin.getId()));
    }

    @PutMapping("/hopitaux/{id}/suspendre")
    public ResponseEntity<HopitalResponse> suspendreHopital(
            @PathVariable Long id,
            Authentication auth) {
        String email = auth.getName();
        Utilisateur admin = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(superAdminService.suspendreHopital(id, admin.getId()));
    }

    // ===== STATISTIQUES GLOBALES =====

    @GetMapping("/stats")
    public ResponseEntity<StatistiquesGlobales> getStatistiquesGlobales() {
        return ResponseEntity.ok(superAdminService.getStatistiquesGlobales());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAnalytics> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardSuperAdmin());
    }

    // ===== NOTIFICATIONS GLOBALES =====

    @PostMapping("/notifications/globale")
    public ResponseEntity<String> envoyerNotificationGlobale(
            @Valid @RequestBody NotificationRequest request) {
        // If a specific role is targeted, send only to that role
        if (request.getRoleCible() != null && !request.getRoleCible().trim().isEmpty()) {
            try {
                Role role = Role.valueOf(request.getRoleCible().toUpperCase());
                notificationService.envoyerNotificationRole(
                        role,
                        request.getTitre(),
                        request.getMessage(),
                        request.getType(),
                        request.getPriorite()
                );
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Rôle invalide: " + request.getRoleCible());
            }
        } else {
            // Otherwise send to all users
            notificationService.envoyerNotificationGlobale(
                    request.getTitre(),
                    request.getMessage(),
                    request.getType(),
                    request.getPriorite()
            );
        }
        return ResponseEntity.ok("Notification envoyée");
    }

    // ===== CAMPAGNES NATIONALES =====

    @PostMapping("/campagnes")
    public ResponseEntity<CampagneResponse> creerCampagneNationale(
            @Valid @RequestBody CampagneRequest request,
            Authentication auth) {
        String email = auth.getName();
        Utilisateur admin = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        request.setNationale(true);
        return ResponseEntity.ok(campagneService.creerCampagne(admin.getId(), request));
    }

    @GetMapping("/campagnes/nationales")
    public ResponseEntity<List<CampagneResponse>> getCampagnesNationales() {
        return ResponseEntity.ok(campagneService.getCampagnesNationales());
    }
}