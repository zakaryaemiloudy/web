package com.bks.service;

import com.bks.dto.*;
import com.bks.enums.PrioriteNotification;
import com.bks.enums.StatutDemande;
import com.bks.enums.StatutCandidature;
import com.bks.enums.TypeNotification;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandeSangService {

    @Autowired
    private DemandeSangRepository demandeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private DonneurRepository donneurRepository;

    @Autowired
    private CandidatureDemandRepository candidatureDemandRepository;

    @Autowired
    private StockService stockService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public DemandeSangResponse creerDemandeParHopital(Long hopitalId, DemandeSangRequest request) {
        Hopital hopital = hopitalRepository.findById(hopitalId)
                .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));

        DemandeSang demande = new DemandeSang();
        demande.setHopital(hopital);
        demande.setGroupeSanguinDemande(request.getGroupeSanguinDemande());
        demande.setQuantiteDemandee(request.getQuantiteDemandee());
        demande.setUrgence(request.getUrgence());
        demande.setNomPatient(request.getNomPatient());
        demande.setPrenomPatient(request.getPrenomPatient());
        demande.setDiagnostic(request.getDiagnostic());
        demande.setMedecinPrescripteur(request.getMedecinPrescripteur());
        demande.setDateBesoin(request.getDateBesoin());
        demande.setNotes(request.getNotes());
        demande.setStatut(StatutDemande.EN_ATTENTE);

        demande = demandeRepository.save(demande);

        notificationService.envoyerNotificationHopital(
                hopital.getId(),
                "Nouvelle demande de sang créée",
                "La demande de sang " + request.getGroupeSanguinDemande() + " a été créée avec succès",
                TypeNotification.ALERTE,
                PrioriteNotification.HAUTE
        );

        return mapToResponse(demande);
    }

    @Transactional
    public DemandeSangResponse creerDemande(Long patientId, DemandeSangRequest request) {
        Utilisateur patient = utilisateurRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        Hopital hopital = hopitalRepository.findById(request.getHopitalId())
                .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));

        DemandeSang demande = new DemandeSang();
        demande.setPatient(patient);
        demande.setHopital(hopital);
        demande.setGroupeSanguinDemande(request.getGroupeSanguinDemande());
        demande.setQuantiteDemandee(request.getQuantiteDemandee());
        demande.setUrgence(request.getUrgence());
        demande.setNomPatient(request.getNomPatient());
        demande.setPrenomPatient(request.getPrenomPatient());
        demande.setDiagnostic(request.getDiagnostic());
        demande.setMedecinPrescripteur(request.getMedecinPrescripteur());
        demande.setDateBesoin(request.getDateBesoin());
        demande.setNotes(request.getNotes());
        demande.setStatut(StatutDemande.EN_ATTENTE);

        demande = demandeRepository.save(demande);

        notificationService.envoyerNotificationHopital(
                hopital.getId(),
                "Nouvelle demande de sang",
                "Une nouvelle demande de sang " + request.getGroupeSanguinDemande() + " a été reçue",
                TypeNotification.ALERTE,
                PrioriteNotification.HAUTE
        );

        return mapToResponse(demande);
    }

    public List<DemandeSangResponse> getDemandesParHopital(Long hopitalId) {
        return demandeRepository.findByHopitalId(hopitalId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DemandeSangResponse> getDemandesUrgentes() {
        return demandeRepository.findDemandesUrgentes().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DemandeSangResponse traiterDemande(Long demandeId, Long adminId, StatutDemande nouveauStatut) {
        DemandeSang demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        demande.setStatut(nouveauStatut);
        demande.setTraiteeParId(adminId);
        demande.setDateTraitement(LocalDateTime.now());

        if (nouveauStatut == StatutDemande.SATISFAITE) {
            stockService.deduireStock(
                    demande.getHopital().getId(),
                    demande.getGroupeSanguinDemande(),
                    demande.getQuantiteDemandee()
            );
        }

        demande = demandeRepository.save(demande);

        notificationService.envoyerNotificationUtilisateur(
                demande.getPatient().getId(),
                "Mise à jour de votre demande",
                "Votre demande de sang a été " + nouveauStatut.name().toLowerCase(),
                TypeNotification.INFO,
                PrioriteNotification.NORMALE
        );

        return mapToResponse(demande);
    }

    private DemandeSangResponse mapToResponse(DemandeSang demande) {
        DemandeSangResponse response = new DemandeSangResponse();
        response.setId(demande.getId());
        response.setPatientId(demande.getPatient() != null ? demande.getPatient().getId() : null);
        response.setPatientEmail(demande.getPatient() != null ? demande.getPatient().getEmail() : null);
        response.setHopitalId(demande.getHopital().getId());
        response.setHopitalNom(demande.getHopital().getNom());
        response.setGroupeSanguinDemande(demande.getGroupeSanguinDemande());
        response.setQuantiteDemandee(demande.getQuantiteDemandee());
        response.setDateDemande(demande.getDateDemande());
        response.setUrgence(demande.getUrgence());
        response.setStatut(demande.getStatut());
        response.setNomPatient(demande.getNomPatient());
        response.setPrenomPatient(demande.getPrenomPatient());
        response.setDiagnostic(demande.getDiagnostic());
        response.setMedecinPrescripteur(demande.getMedecinPrescripteur());
        response.setDateBesoin(demande.getDateBesoin());
        response.setNotes(demande.getNotes());
        response.setDateTraitement(demande.getDateTraitement());
        return response;
    }

    // ===== CANDIDATURES DONNEUR =====

    public List<DemandeSangResponse> getDemandesDisponibles(Long donneurId) {
        Donneur donneur = donneurRepository.findById(donneurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));

        // Get all pending demands that match donor's blood group
        List<DemandeSang> demandes = demandeRepository.findByGroupeSanguinDemandeAndStatut(
                donneur.getGroupeSanguin(), StatutDemande.EN_ATTENTE);

        // Filter out demands the donor has already applied to
        return demandes.stream()
                .filter(d -> candidatureDemandRepository
                        .findByDemandeIdAndDonneurId(d.getId(), donneurId).isEmpty())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CandidatureDemandResponse postulerDemande(Long donneurId, Long demandeId) {
        Donneur donneur = donneurRepository.findById(donneurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));

        DemandeSang demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        // Check if donor has already applied
        if (candidatureDemandRepository.findByDemandeIdAndDonneurId(demandeId, donneurId).isPresent()) {
            throw new RuntimeException("Vous avez déjà postulé pour cette demande");
        }

        // Check blood group compatibility
        if (!donneur.getGroupeSanguin().equals(demande.getGroupeSanguinDemande())) {
            throw new RuntimeException("Votre groupe sanguin n'est pas compatible");
        }

        CandidatureDemande candidature = CandidatureDemande.builder()
                .demande(demande)
                .donneur(donneur)
                .statut(com.bks.enums.StatutCandidature.EN_ATTENTE)
                .dateCandidature(LocalDateTime.now())
                .build();

        candidature = candidatureDemandRepository.save(candidature);

        // Notify hospital about new candidacy
        notificationService.envoyerNotificationHopital(
                demande.getHopital().getId(),
                "Nouvelle candidature",
                "Un donneur a postulé pour la demande de sang " + demande.getGroupeSanguinDemande(),
                TypeNotification.ALERTE,
                PrioriteNotification.NORMALE
        );

        return mapCandidatureToResponse(candidature, donneur);
    }

    public List<CandidatureDemandResponse> getCandidaturesDonneur(Long donneurId) {
        return candidatureDemandRepository.findByDonneurId(donneurId).stream()
                .map(c -> {
                    DemandeSang demande = c.getDemande();
                    return mapCandidatureToResponse(c, c.getDonneur());
                })
                .collect(Collectors.toList());
    }

    public List<CandidatureDemandResponse> getCandidaturesDemande(Long demandeId) {
        return candidatureDemandRepository.findByDemandeId(demandeId).stream()
                .map(c -> mapCandidatureToResponse(c, c.getDonneur()))
                .collect(Collectors.toList());
    }

    @Autowired
    private DonRepository donRepository;

    @Transactional
    public CandidatureDemandResponse traiterCandidature(Long candidatureId, com.bks.enums.StatutCandidature statut) {
        CandidatureDemande candidature = candidatureDemandRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        candidature.setStatut(statut);
        candidature.setDateTraitement(LocalDateTime.now());
        candidature = candidatureDemandRepository.save(candidature);

        // If accepted, create a pending Don record so it appears in admin/dons
        if (statut == com.bks.enums.StatutCandidature.ACCEPTEE) {
            DemandeSang demande = candidature.getDemande();
            Donneur donneur = candidature.getDonneur();
            
            Don don = new Don();
            don.setDonneur(donneur);
            don.setHopital(demande.getHopital());
            don.setStatut(com.bks.enums.StatutDon.EN_ATTENTE);
            don.setDateDon(LocalDateTime.now());
            don.setQuantiteMl(demande.getQuantiteDemandee());
            don.setNotes("Don issu de la demande #" + demande.getId());
            donRepository.save(don);
        }

        // Notify donor about candidacy status
        String message = statut == com.bks.enums.StatutCandidature.ACCEPTEE 
                ? "Votre candidature a été acceptée" 
                : "Votre candidature a été rejetée";
        
        notificationService.envoyerNotificationUtilisateur(
                candidature.getDonneur().getUtilisateur().getId(),
                "Mise à jour de candidature",
                message,
                TypeNotification.INFO,
                PrioriteNotification.NORMALE
        );

        return mapCandidatureToResponse(candidature, candidature.getDonneur());
    }

    private CandidatureDemandResponse mapCandidatureToResponse(CandidatureDemande candidature, Donneur donneur) {
        CandidatureDemandResponse response = new CandidatureDemandResponse();
        response.setId(candidature.getId());
        response.setDemandeId(candidature.getDemande().getId());
        response.setDonneurId(donneur.getId());
        response.setDonneurNom(donneur.getUtilisateur().getNom());
        response.setDonneurPrenom(donneur.getUtilisateur().getPrenom());
        response.setDonneurEmail(donneur.getUtilisateur().getEmail());
        response.setDonneurGroupeSanguin(donneur.getGroupeSanguin().name());
        response.setGroupeSanguinDemande(candidature.getDemande().getGroupeSanguinDemande().name());
        response.setStatut(candidature.getStatut());
        response.setDateCandidature(candidature.getDateCandidature());
        response.setDateTraitement(candidature.getDateTraitement());
        response.setNotes(candidature.getNotes());
        response.setPeutDonner(candidature.getPeutDonner());
        return response;
    }
}
