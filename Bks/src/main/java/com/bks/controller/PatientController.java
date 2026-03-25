
// ========== PatientController.java ==========
package com.bks.controller;

import com.bks.dto.*;
import com.bks.service.*;
import com.bks.repository.*;
import com.bks.model.*;
import com.bks.enums.StatutHopital;
import com.bks.enums.GroupeSanguin;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPER_ADMIN')")
public class PatientController {

    @Autowired
    private DemandeSangService demandeService;

    @Autowired
    private StockService stockService;

    @Autowired
    private DemandeSangRepository demandeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private StockSangRepository stockRepository;

    // ===== DEMANDES DE SANG =====

    @PostMapping("/demandes")
    public ResponseEntity<DemandeSangResponse> creerDemande(
            @Valid @RequestBody DemandeSangRequest request,
            Authentication auth) {
        var user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(demandeService.creerDemande(user.getId(), request));
    }

    @GetMapping("/demandes")
    public ResponseEntity<List<DemandeSangResponse>> getMesDemandes(Authentication auth) {
        var user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(
                demandeRepository.findByPatientId(user.getId()).stream()
                        .map(d -> {
                            DemandeSangResponse r = new DemandeSangResponse();
                            r.setId(d.getId());
                            r.setGroupeSanguinDemande(d.getGroupeSanguinDemande());
                            r.setQuantiteDemandee(d.getQuantiteDemandee());
                            r.setStatut(d.getStatut());
                            r.setUrgence(d.getUrgence());
                            r.setDateDemande(d.getDateDemande());
                            r.setHopitalNom(d.getHopital().getNom());
                            return r;
                        })
                        .toList()
        );
    }

    @GetMapping("/demandes/{id}")
    public ResponseEntity<DemandeSangResponse> getDetailsDemande(@PathVariable Long id) {
        var demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        DemandeSangResponse response = new DemandeSangResponse();
        response.setId(demande.getId());
        response.setGroupeSanguinDemande(demande.getGroupeSanguinDemande());
        response.setQuantiteDemandee(demande.getQuantiteDemandee());
        response.setStatut(demande.getStatut());
        response.setUrgence(demande.getUrgence());
        response.setDateDemande(demande.getDateDemande());
        response.setHopitalNom(demande.getHopital().getNom());
        response.setNomPatient(demande.getNomPatient());
        response.setPrenomPatient(demande.getPrenomPatient());

        return ResponseEntity.ok(response);
    }

    // ===== CONSULTATION STOCKS =====

    @GetMapping("/stocks/{hopitalId}")
    public ResponseEntity<List<StockResponse>> consulterStocks(@PathVariable Long hopitalId) {
        return ResponseEntity.ok(stockService.getStockParHopital(hopitalId));
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

    // ===== HOSPITAL MANAGEMENT =====

    @GetMapping("/hopitaux")
    public ResponseEntity<List<HopitalResponse>> getAvailableHospitals() {
        List<Hopital> hopitaux = hopitalRepository.findByStatut(StatutHopital.VALIDE);
        List<HopitalResponse> response = hopitaux.stream()
                .map(this::mapToHopitalResponse)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hopitaux/{id}")
    public ResponseEntity<HopitalResponse> getHospitalById(@PathVariable Long id) {
        Hopital hopital = hopitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));
        return ResponseEntity.ok(mapToHopitalResponse(hopital));
    }

    private HopitalResponse mapToHopitalResponse(Hopital hopital) {
        HopitalResponse response = new HopitalResponse();
        response.setId(hopital.getId());
        response.setNom(hopital.getNom());
        response.setAdresse(hopital.getAdresse());
        response.setVille(hopital.getVille());
        response.setRegion(hopital.getRegion());
        response.setTelephone(hopital.getTelephone());
        response.setEmail(hopital.getEmail());
        response.setStatut(hopital.getStatut());
        response.setCapaciteStockage(hopital.getCapaciteStockage());
        response.setCertifie(hopital.getCertifie());
        response.setScorePerformance(hopital.getScorePerformance());
        response.setDescription(hopital.getDescription());
        
        // Calculate current stock total
        List<StockSang> stocks = stockRepository.findByHopitalId(hopital.getId());
        Integer stockTotal = stocks.stream()
                .mapToInt(stock -> stock.getQuantiteDisponible())
                .sum();
        response.setStockActuel(stockTotal);
        
        return response;
    }

    // ===== BLOOD TYPE MANAGEMENT =====

    @PutMapping("/blood-type")
    public ResponseEntity<Utilisateur> updateBloodType(
            @RequestBody Map<String, String> request,
            Authentication auth) {
        Utilisateur user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String groupeSanguin = request.get("groupeSanguin");
        if (groupeSanguin == null || groupeSanguin.trim().isEmpty()) {
            throw new RuntimeException("Groupe sanguin requis");
        }

        // Validate blood type
        try {
            GroupeSanguin.valueOf(groupeSanguin.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Groupe sanguin invalide");
        }

        user.setGroupeSanguin(groupeSanguin);
        utilisateurRepository.save(user);
        
        return ResponseEntity.ok(user);
    }
}
