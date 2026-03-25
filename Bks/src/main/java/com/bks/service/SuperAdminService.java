package com.bks.service;

import com.bks.dto.*;
import com.bks.enums.Role;
import com.bks.enums.StatutDemande;
import com.bks.enums.StatutHopital;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuperAdminService {

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private DonRepository donRepository;

    @Autowired
    private DemandeSangRepository demandeRepository;

    @Autowired
    private DonneurRepository donneurRepository;

    @Autowired
    private CampagneDonRepository campagneRepository;

    @Transactional
    public HopitalResponse validerHopital(Long hopitalId, Long superAdminId) {
        Hopital hopital = hopitalRepository.findById(hopitalId)
                .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));

        hopital.setStatut(StatutHopital.VALIDE);
        hopital.setDateValidation(LocalDateTime.now());
        hopital.setValideParId(superAdminId);

        return mapToHopitalResponse(hopitalRepository.save(hopital));
    }

    @Transactional
    public HopitalResponse suspendreHopital(Long hopitalId, Long superAdminId) {
        Hopital hopital = hopitalRepository.findById(hopitalId)
                .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));

        hopital.setStatut(StatutHopital.SUSPENDU);

        return mapToHopitalResponse(hopitalRepository.save(hopital));
    }

    public StatistiquesGlobales getStatistiquesGlobales() {
        StatistiquesGlobales stats = new StatistiquesGlobales();

        List<Hopital> hopitaux = hopitalRepository.findAll();
        stats.setTotalHopitaux(hopitaux.size());
        stats.setHopitauxActifs((int) hopitaux.stream()
                .filter(h -> h.getStatut() == StatutHopital.VALIDE).count());
        stats.setHopitauxEnAttente((int) hopitaux.stream()
                .filter(h -> h.getStatut() == StatutHopital.EN_ATTENTE).count());

        stats.setTotalDonneurs(donneurRepository.findAll().size());
        stats.setTotalAdmins((int) utilisateurRepository.findByRole(Role.ADMIN).size());
        stats.setTotalUtilisateurs(utilisateurRepository.findAll().size());

        stats.setTotalDons(donRepository.count());
        stats.setTotalDemandes(demandeRepository.count());

        stats.setCampagnesActives((int) campagneRepository.findCampagnesActives(LocalDateTime.now()).size());

        Map<String, Integer> parRegion = new HashMap<>();
        for (Hopital h : hopitaux) {
            parRegion.put(h.getRegion(), parRegion.getOrDefault(h.getRegion(), 0) + 1);
        }
        stats.setHopitauxParRegion(parRegion);

        Map<String, Long> donsParMois = new HashMap<>();
        for (int i = 0; i < 6; i++) {
            LocalDateTime debut = LocalDateTime.now().minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0);
            LocalDateTime fin = debut.plusMonths(1);

            long count = donRepository.findAll().stream()
                    .filter(d -> d.getDateDon().isAfter(debut) && d.getDateDon().isBefore(fin))
                    .count();

            String mois = debut.getMonth().toString();
            donsParMois.put(mois, count);
        }
        stats.setDonsParMois(donsParMois);

        Map<String, Integer> donneursParVille = donneurRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        Donneur::getVille,
                        Collectors.summingInt(d -> 1)
                ));
        stats.setDonneursParVille(donneursParVille);

        long totalDemandes = demandeRepository.count();
        if (totalDemandes > 0) {
            long satisfaites = demandeRepository.findAll().stream()
                    .filter(d -> d.getStatut() == StatutDemande.SATISFAITE)
                    .count();
            stats.setTauxSatisfactionGlobal((satisfaites * 100.0) / totalDemandes);
        } else {
            stats.setTauxSatisfactionGlobal(0.0);
        }

        return stats;
    }

    public List<HopitalResponse> getHopitauxEnAttente() {
        return hopitalRepository.findByStatut(StatutHopital.EN_ATTENTE).stream()
                .map(this::mapToHopitalResponse)
                .collect(Collectors.toList());
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
        response.setDateCreation(hopital.getDateCreation());
        response.setDateValidation(hopital.getDateValidation());
        response.setCertifie(hopital.getCertifie());
        response.setScorePerformance(hopital.getScorePerformance());
        response.setDescription(hopital.getDescription());
        return response;
    }
}
