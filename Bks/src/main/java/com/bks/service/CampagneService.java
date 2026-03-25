package com.bks.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bks.dto.CampagneRequest;
import com.bks.dto.CampagneResponse;
import com.bks.enums.PrioriteNotification;
import com.bks.enums.StatutCampagne;
import com.bks.enums.TypeNotification;
import com.bks.model.CampagneDon;
import com.bks.model.Hopital;
import com.bks.repository.CampagneDonRepository;
import com.bks.repository.HopitalRepository;

@Service
public class CampagneService {

    @Autowired
    private CampagneDonRepository campagneRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public CampagneResponse creerCampagne(Long createurId, CampagneRequest request) {
        CampagneDon campagne = new CampagneDon();
        campagne.setTitre(request.getTitre());
        campagne.setDescription(request.getDescription());
        campagne.setVille(request.getVille());
        campagne.setRegion(request.getRegion());
        campagne.setDateDebut(request.getDateDebut());
        campagne.setDateFin(request.getDateFin());
        campagne.setObjectifDonneurs(request.getObjectifDonneurs());
        campagne.setGroupeSanguinCible(request.getGroupeSanguinCible());
        campagne.setNationale(request.getNationale());
        campagne.setLieuCollecte(request.getLieuCollecte());
        campagne.setContactInfo(request.getContactInfo());
        campagne.setImageUrl(request.getImageUrl());
        campagne.setCreeeParId(createurId);

        if (request.getHopitalId() != null) {
            Hopital hopital = hopitalRepository.findById(request.getHopitalId())
                    .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));
            campagne.setHopital(hopital);
        }

        if (request.getDateDebut().isAfter(LocalDateTime.now())) {
            campagne.setStatut(StatutCampagne.PLANIFIEE);
        } else {
            campagne.setStatut(StatutCampagne.EN_COURS);
        }

        campagne = campagneRepository.save(campagne);

        if (campagne.getNationale()) {
            notificationService.envoyerNotificationGlobale(
                    "🎯 Nouvelle Campagne Nationale",
                    "Campagne: " + campagne.getTitre() + " - " + campagne.getVille(),
                    TypeNotification.INFO,
                    PrioriteNotification.NORMALE
            );
        }

        return mapToResponse(campagne);
    }

    public CampagneDon getCampagneById(Long id) {
        return campagneRepository.findById(id).orElse(null);
    }

    public List<CampagneResponse> getCampagnesActives() {
        return campagneRepository.findCampagnesActives(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CampagneResponse> getCampagnesNationales() {
        return campagneRepository.findByNationaleTrueOrderByDateDebutDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CampagneResponse participerCampagne(Long campagneId, Long donneurId) {
        CampagneDon campagne = campagneRepository.findById(campagneId)
                .orElseThrow(() -> new RuntimeException("Campagne non trouvée"));

        campagne.setNombreParticipants(campagne.getNombreParticipants() + 1);
        // Also increment blood collected metrics (simulating that participants donate)
        campagne.setNombreDonsCollectes(campagne.getNombreDonsCollectes() + 1);
        campagne.setQuantiteCollectee(campagne.getQuantiteCollectee() + 450); // Average 450ml per donation
        campagne = campagneRepository.save(campagne);

        return mapToResponse(campagne);
    }

    @Transactional
    public void mettreAJourStatutCampagnes() {
        List<CampagneDon> campagnes = campagneRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (CampagneDon campagne : campagnes) {
            if (campagne.getDateDebut().isAfter(now)) {
                campagne.setStatut(StatutCampagne.PLANIFIEE);
            } else if (campagne.getDateFin().isBefore(now)) {
                campagne.setStatut(StatutCampagne.TERMINEE);
            } else {
                campagne.setStatut(StatutCampagne.EN_COURS);
            }
            campagneRepository.save(campagne);
        }
    }

    public CampagneResponse mapToResponse(CampagneDon campagne) {
        CampagneResponse response = new CampagneResponse();
        response.setId(campagne.getId());
        response.setTitre(campagne.getTitre());
        response.setDescription(campagne.getDescription());
        response.setVille(campagne.getVille());
        response.setRegion(campagne.getRegion());
        response.setDateDebut(campagne.getDateDebut());
        response.setDateFin(campagne.getDateFin());
        response.setObjectifDonneurs(campagne.getObjectifDonneurs());
        response.setNombreParticipants(campagne.getNombreParticipants());
        response.setGroupeSanguinCible(campagne.getGroupeSanguinCible());
        response.setStatut(campagne.getStatut());
        response.setNationale(campagne.getNationale());
        response.setDateCreation(campagne.getDateCreation());
        response.setLieuCollecte(campagne.getLieuCollecte());
        response.setContactInfo(campagne.getContactInfo());
        response.setImageUrl(campagne.getImageUrl());
        response.setNombreDonsCollectes(campagne.getNombreDonsCollectes());
        response.setQuantiteCollectee(campagne.getQuantiteCollectee());
        response.setProgressionPourcentage(campagne.getProgressionPourcentage());

        if (campagne.getHopital() != null) {
            response.setHopitalId(campagne.getHopital().getId());
            response.setHopitalNom(campagne.getHopital().getNom());
        }

        return response;
    }
}