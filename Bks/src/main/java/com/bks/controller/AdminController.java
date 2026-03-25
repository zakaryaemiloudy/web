package com.bks.controller;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bks.dto.CampagneRequest;
import com.bks.dto.CampagneResponse;
import com.bks.dto.DashboardAnalytics;
import com.bks.dto.DemandeSangRequest;
import com.bks.dto.DemandeSangResponse;
import com.bks.dto.CandidatureDemandResponse;
import com.bks.dto.DonResponse;
import com.bks.dto.DonneurResponse;
import com.bks.dto.StockResponse;
import com.bks.enums.StatutDemande;
import com.bks.enums.StatutCandidature;
import com.bks.enums.StatutDon;
import com.bks.model.Don;
import com.bks.model.Utilisateur;
import com.bks.repository.CampagneDonRepository;
import com.bks.repository.DonRepository;
import com.bks.repository.UtilisateurRepository;
import com.bks.service.CampagneService;
import com.bks.service.DashboardService;
import com.bks.service.DemandeSangService;
import com.bks.service.DonneurService;
import com.bks.service.GamificationService;
import com.bks.service.StockService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    @Autowired
    private DonneurService donneurService;

    @Autowired
    private DemandeSangService demandeService;

    @Autowired
    private StockService stockService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private CampagneService campagneService;

    @Autowired
    private DonRepository donRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private GamificationService gamificationService;

    @Autowired
    private CampagneDonRepository campagneRepository;

    // ===== DASHBOARD =====

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAnalytics> getDashboard(Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Handle SUPER_ADMIN who doesn't have a hospital
        if (admin.getRole() == com.bks.enums.Role.SUPER_ADMIN) {
            return ResponseEntity.ok(dashboardService.getDashboardSuperAdmin());
        }

        if (admin.getHopital() == null) {
            throw new RuntimeException("Admin non associé à un hôpital");
        }

        return ResponseEntity.ok(dashboardService.getDashboardAdmin(admin.getHopital().getId()));
    }

    // ===== GESTION DONS =====

    @GetMapping("/dons")
    public ResponseEntity<List<DonResponse>> getDons(Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<DonResponse> responses = donRepository.findByHopitalId(admin.getHopital().getId())
                .stream()
                .map(donneurService::mapDonToResponse)
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/dons/{id}/valider")
    public ResponseEntity<DonResponse> validerDon(
            @PathVariable Long id,
            Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Don don = donRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Don non trouvé"));

        don.setStatut(StatutDon.VALIDE);
        don.setValideParId(admin.getId());
        don.setDateValidation(LocalDateTime.now());
        don.setDatePeremption(LocalDateTime.now().plusDays(42));
        don.setNumeroPoche("POCHE-" + System.currentTimeMillis());

        don = donRepository.save(don);

        // Ajouter au stock
        stockService.ajouterStock(
                don.getHopital().getId(),
                don.getDonneur().getGroupeSanguin(),
                don.getQuantiteMl()
        );

        // Attribuer points et badges
        gamificationService.attribuerPoints(don.getDonneur().getId(), 10);
        gamificationService.verifierEtAttribuerBadges(don.getDonneur().getId());

        return ResponseEntity.ok(donneurService.mapDonToResponse(don));
    }

    @PutMapping("/dons/{id}/rejeter")
    public ResponseEntity<DonResponse> rejeterDon(@PathVariable Long id, @RequestBody String raison) {
        Don don = donRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Don non trouvé"));

        don.setStatut(StatutDon.REJETE);
        don.setNotes(raison);

        don = donRepository.save(don);

        return ResponseEntity.ok(donneurService.mapDonToResponse(don));
    }

    // ===== GESTION DEMANDES =====

    @PostMapping("/demandes")
    public ResponseEntity<DemandeSangResponse> creerDemande(
            @RequestBody DemandeSangRequest request,
            Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(demandeService.creerDemandeParHopital(admin.getHopital().getId(), request));
    }

    @GetMapping("/demandes")
    public ResponseEntity<List<DemandeSangResponse>> getDemandes(Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(demandeService.getDemandesParHopital(admin.getHopital().getId()));
    }

    @GetMapping("/demandes/urgentes")
    public ResponseEntity<List<DemandeSangResponse>> getDemandesUrgentes() {
        return ResponseEntity.ok(demandeService.getDemandesUrgentes());
    }

    @PutMapping("/demandes/{id}/traiter")
    public ResponseEntity<DemandeSangResponse> traiterDemande(
            @PathVariable Long id,
            @RequestParam StatutDemande statut,
            Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(demandeService.traiterDemande(id, admin.getId(), statut));
    }

    @GetMapping("/demandes/{demandeId}/candidatures")
    public ResponseEntity<List<CandidatureDemandResponse>> getCandidaturesDemande(
            @PathVariable Long demandeId) {
        return ResponseEntity.ok(demandeService.getCandidaturesDemande(demandeId));
    }

    @PutMapping("/candidatures/{candidatureId}/traiter")
    public ResponseEntity<CandidatureDemandResponse> traiterCandidature(
            @PathVariable Long candidatureId,
            @RequestParam com.bks.enums.StatutCandidature statut) {
        return ResponseEntity.ok(demandeService.traiterCandidature(candidatureId, statut));
    }

    // ===== GESTION STOCKS =====

    @GetMapping("/stocks")
    public ResponseEntity<List<StockResponse>> getStocks(Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(stockService.getStockParHopital(admin.getHopital().getId()));
    }

    @GetMapping("/stocks/critiques")
    public ResponseEntity<List<StockResponse>> getStocksCritiques() {
        return ResponseEntity.ok(stockService.getStocksCritiques());
    }

    @PutMapping("/stocks/{stockId}")
    public ResponseEntity<StockResponse> updateStock(
            @PathVariable Long stockId,
            @RequestParam Integer nouvelleQuantite,
            Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return ResponseEntity.ok(stockService.updateStockQuantity(stockId, nouvelleQuantite, admin.getHopital().getId()));
    }

    @PutMapping("/stocks/{stockId}/seuils")
    public ResponseEntity<StockResponse> updateStockSeuils(
            @PathVariable Long stockId,
            @RequestParam Integer seuilAlerte,
            @RequestParam Integer seuilCritique,
            Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return ResponseEntity.ok(stockService.updateStockSeuils(stockId, seuilAlerte, seuilCritique, admin.getHopital().getId()));
    }

    // ===== GESTION DONNEURS =====

    @GetMapping("/donneurs")
    public ResponseEntity<List<DonneurResponse>> getDonneurs() {
        return ResponseEntity.ok(donneurService.getDonneursEligibles());
    }

    @GetMapping("/donneurs/top")
    public ResponseEntity<List<DonneurResponse>> getTopDonneurs() {
        return ResponseEntity.ok(donneurService.getTopDonneurs(10));
    }

    // ===== CAMPAGNES =====

    @GetMapping("/campagnes")
    public ResponseEntity<List<CampagneResponse>> getCampagnesHopital(Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Get all campaigns for this hospital
        List<CampagneResponse> campaigns = campagneRepository.findByHopitalId(admin.getHopital().getId())
                .stream()
                .map(campagneService::mapToResponse)
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(campaigns);
    }

    @PostMapping("/campagnes")
    public ResponseEntity<CampagneResponse> creerCampagne(
            @Valid @RequestBody CampagneRequest request,
            Authentication auth) {
        Utilisateur admin = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        request.setHopitalId(admin.getHopital().getId());
        request.setNationale(false);

        return ResponseEntity.ok(campagneService.creerCampagne(admin.getId(), request));
    }

    @GetMapping("/campagnes/actives")
    public ResponseEntity<List<CampagneResponse>> getCampagnesActives() {
        return ResponseEntity.ok(campagneService.getCampagnesActives());
    }
}