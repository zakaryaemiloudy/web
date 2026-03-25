package com.bks.controller;

import java.util.List;

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

import com.bks.dto.BadgeResponse;
import com.bks.dto.CampagneResponse;
import com.bks.dto.DonRequest;
import com.bks.dto.DonResponse;
import com.bks.dto.DonneurResponse;
import com.bks.dto.DemandeSangResponse;
import com.bks.dto.CandidatureDemandResponse;
import com.bks.dto.DonneurUpdateRequest;
import com.bks.dto.RoleToggleRequest;
import com.bks.enums.StatutDon;
import com.bks.model.CampagneDon;
import com.bks.model.Don;
import com.bks.model.Donneur;
import com.bks.model.Hopital;
import com.bks.model.Utilisateur;
import com.bks.repository.DonRepository;
import com.bks.repository.DonneurRepository;
import com.bks.repository.HopitalRepository;
import com.bks.repository.UtilisateurRepository;
import com.bks.service.CampagneService;
import com.bks.service.DemandeSangService;
import com.bks.service.DonneurService;
import com.bks.service.GamificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donneur")
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
public class DonneurController {

    private final DonneurService donneurService;
    private final DonneurRepository donneurRepository;
    private final DonRepository donRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final HopitalRepository hopitalRepository;
    private final GamificationService gamificationService;
    private final CampagneService campagneService;
    private final DemandeSangService demandeService;

    public DonneurController(DonneurService donneurService,
                             DonneurRepository donneurRepository,
                             DonRepository donRepository,
                             UtilisateurRepository utilisateurRepository,
                             HopitalRepository hopitalRepository,
                             GamificationService gamificationService,
                             CampagneService campagneService,
                             DemandeSangService demandeService) {
        this.donneurService = donneurService;
        this.donneurRepository = donneurRepository;
        this.donRepository = donRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.hopitalRepository = hopitalRepository;
        this.gamificationService = gamificationService;
        this.campagneService = campagneService;
        this.demandeService = demandeService;
    }

    // ===== PROFIL DONNEUR =====

    @PostMapping("/profil")
    public ResponseEntity<DonneurResponse> creerProfil(
            @Valid @RequestBody Donneur donneur,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(donneurService.inscrireDonneur(user.getId(), donneur));
    }

    @GetMapping("/profil")
    public ResponseEntity<DonneurResponse> getProfil(Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(donneurService.getDonneurByUtilisateurId(user.getId()));
    }

    @PutMapping("/profil")
    public ResponseEntity<DonneurResponse> updateProfil(
            @RequestBody DonneurUpdateRequest request,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(donneurService.updateProfilComplet(
                user.getId(),
                request.getNom(),
                request.getPrenom(),
                request.getTelephone(),
                request
        ));
    }

    // ===== DONS =====

    @PostMapping("/dons")
    public ResponseEntity<DonResponse> declarerDon(
            @Valid @RequestBody DonRequest request,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        if (!donneur.getEligible()) {
            throw new RuntimeException("Vous n'êtes pas éligible pour donner actuellement");
        }

        // Determine hospital - either directly or from campaign
        Hopital hopital = null;
        CampagneDon campagne = null;
        
        // If campaign is provided, use its hospital
        if (request.getCampagneId() != null) {
            campagne = campagneService.getCampagneById(request.getCampagneId());
            if (campagne == null) {
                throw new RuntimeException("Campagne non trouvée");
            }
            hopital = campagne.getHopital();
            if (hopital == null) {
                throw new RuntimeException("La campagne n'est associée à aucun hôpital");
            }
        } else if (request.getHopitalId() != null) {
            // If no campaign, use the provided hospital ID
            hopital = hopitalRepository.findById(request.getHopitalId())
                    .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));
        } else {
            throw new RuntimeException("Un hôpital ou une campagne doit être fourni");
        }

        Don don = new Don();
        don.setDonneur(donneur);
        don.setHopital(hopital);
        don.setQuantiteMl(request.getQuantiteMl());
        don.setNotes(request.getNotes());
        don.setStatut(StatutDon.EN_ATTENTE);
        
        // Set donation date if provided, otherwise use current time
        if (request.getDateDon() != null) {
            don.setDateDon(request.getDateDon());
        }

        // Set campaign if it was selected
        if (campagne != null) {
            don.setCampagne(campagne);
        }

        don = donRepository.save(don);

        return ResponseEntity.ok(donneurService.mapDonToResponse(don));
    }

    @GetMapping("/dons/historique")
    public ResponseEntity<List<DonResponse>> getHistoriqueDons(Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        List<DonResponse> responses = donRepository.findByDonneurId(donneur.getId())
                .stream()
                .map(donneurService::mapDonToResponse)
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // ===== BADGES & GAMIFICATION =====

    @GetMapping("/badges")
    public ResponseEntity<List<BadgeResponse>> getMesBadges(Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        return ResponseEntity.ok(gamificationService.getBadgesDonneur(donneur.getId()));
    }

    @GetMapping("/points")
    public ResponseEntity<Integer> getMesPoints(Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(user.getPointsTotal());
    }

    @GetMapping("/classement")
    public ResponseEntity<List<DonneurResponse>> getClassement() {
        return ResponseEntity.ok(donneurService.getTopDonneurs(50));
    }

    // ===== CAMPAGNES =====

    @GetMapping("/campagnes")
    public ResponseEntity<List<CampagneResponse>> getCampagnesDisponibles() {
        return ResponseEntity.ok(campagneService.getCampagnesActives());
    }

    @PostMapping("/campagnes/{id}/participer")
    public ResponseEntity<CampagneResponse> participerCampagne(
            @PathVariable Long id,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        return ResponseEntity.ok(campagneService.participerCampagne(id, donneur.getId()));
    }

    // ===== DEMANDES DE SANG =====

    @GetMapping("/demandes-disponibles")
    public ResponseEntity<List<DemandeSangResponse>> getDemandesDisponibles(Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        return ResponseEntity.ok(demandeService.getDemandesDisponibles(donneur.getId()));
    }

    @PostMapping("/demandes/{demandeId}/postuler")
    public ResponseEntity<CandidatureDemandResponse> postulerDemande(
            @PathVariable Long demandeId,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        return ResponseEntity.ok(demandeService.postulerDemande(donneur.getId(), demandeId));
    }

    @GetMapping("/mes-candidatures")
    public ResponseEntity<List<CandidatureDemandResponse>> getMesCandidatures(Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Donneur donneur = donneurRepository.findByUtilisateurId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil donneur non trouvé"));

        return ResponseEntity.ok(demandeService.getCandidaturesDonneur(donneur.getId()));
    }

    // ===== ROLE TOGGLE =====

    @PutMapping("/role-toggle")
    public ResponseEntity<Utilisateur> toggleRole(
            @Valid @RequestBody RoleToggleRequest request,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setIsDonneurActif(request.getIsDonneurActif());
        user.setIsPatientActif(request.getIsPatientActif());
        
        utilisateurRepository.save(user);
        
        return ResponseEntity.ok(user);
    }
}