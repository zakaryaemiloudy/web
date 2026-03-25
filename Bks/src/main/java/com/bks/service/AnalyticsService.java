package com.bks.service;

import com.bks.enums.StatutDemande;
import com.bks.enums.StatutDon;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private DonRepository donRepository;

    @Autowired
    private DemandeSangRepository demandeRepository;

    @Autowired
    private StatistiquesQuotidiennesRepository statsRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    public Map<String, Integer> getDonsParGroupe(Long hopitalId) {
        List<Don> dons;
        if (hopitalId != null) {
            dons = donRepository.findByHopitalId(hopitalId);
        } else {
            dons = donRepository.findAll();
        }

        return dons.stream()
                .filter(d -> d.getStatut() == StatutDon.VALIDE)
                .collect(Collectors.groupingBy(
                        d -> d.getDonneur().getGroupeSanguin().toString(),
                        Collectors.summingInt(d -> 1)
                ));
    }

    public Map<String, Integer> getDemandesParGroupe(Long hopitalId) {
        List<DemandeSang> demandes;
        if (hopitalId != null) {
            demandes = demandeRepository.findByHopitalId(hopitalId);
        } else {
            demandes = demandeRepository.findAll();
        }

        return demandes.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getGroupeSanguinDemande().toString(),
                        Collectors.summingInt(d -> 1)
                ));
    }

    public Map<String, Integer> getEvolutionDons(Long hopitalId, int derniersMois) {
        LocalDateTime dateDebut = LocalDateTime.now().minusMonths(derniersMois);
        List<Don> dons;

        if (hopitalId != null) {
            dons = donRepository.findByHopitalAndDateBetween(hopitalId, dateDebut, LocalDateTime.now());
        } else {
            dons = donRepository.findAll().stream()
                    .filter(d -> d.getDateDon().isAfter(dateDebut))
                    .collect(Collectors.toList());
        }

        return dons.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDateDon().toLocalDate().toString(),
                        Collectors.summingInt(d -> 1)
                ));
    }

    public Double getTauxSatisfaction(Long hopitalId, LocalDate dateDebut, LocalDate dateFin) {
        List<DemandeSang> demandes;

        if (hopitalId != null) {
            demandes = demandeRepository.findByHopitalId(hopitalId);
        } else {
            demandes = demandeRepository.findAll();
        }

        demandes = demandes.stream()
                .filter(d -> {
                    LocalDate date = d.getDateDemande().toLocalDate();
                    return !date.isBefore(dateDebut) && !date.isAfter(dateFin);
                })
                .collect(Collectors.toList());

        if (demandes.isEmpty()) return 0.0;

        long satisfaites = demandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.SATISFAITE)
                .count();

        return (satisfaites * 100.0) / demandes.size();
    }

    public void genererStatistiquesQuotidiennes(Long hopitalId, LocalDate date) {
        StatistiquesQuotidiennes stats = statsRepository
                .findByHopitalIdAndDate(hopitalId, date)
                .orElseGet(() -> {
                    StatistiquesQuotidiennes newStats = new StatistiquesQuotidiennes();
                    Hopital hopital = hopitalRepository.findById(hopitalId).orElse(null);
                    newStats.setHopital(hopital);
                    return newStats;
                });

        LocalDateTime debutJour = date.atStartOfDay();
        LocalDateTime finJour = date.plusDays(1).atStartOfDay();

        List<Don> dons = donRepository.findByHopitalAndDateBetween(hopitalId, debutJour, finJour);
        stats.setNombreDons(dons.size());
        stats.setQuantiteCollectee(dons.stream()
                .mapToInt(Don::getQuantiteMl)
                .sum());

        List<DemandeSang> demandes = demandeRepository.findByDateDemandeBetween(debutJour, finJour)
                .stream()
                .filter(d -> d.getHopital().getId().equals(hopitalId))
                .collect(Collectors.toList());

        stats.setNombreDemandes(demandes.size());
        stats.setDemandesSatisfaites((int) demandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.SATISFAITE)
                .count());

        stats.setQuantiteDistribuee(demandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.SATISFAITE)
                .mapToInt(DemandeSang::getQuantiteDemandee)
                .sum());

        if (stats.getNombreDemandes() > 0) {
            stats.setTauxSatisfaction(
                    (stats.getDemandesSatisfaites() * 100.0) / stats.getNombreDemandes()
            );
        }

        stats.setDate(date);
        statsRepository.save(stats);
    }

    public String genererRecommandations(Long hopitalId) {
        StringBuilder recommandations = new StringBuilder();

        Map<String, Integer> donsParGroupe = getDonsParGroupe(hopitalId);
        Map<String, Integer> demandesParGroupe = getDemandesParGroupe(hopitalId);

        for (String groupe : demandesParGroupe.keySet()) {
            int demandes = demandesParGroupe.get(groupe);
            int dons = donsParGroupe.getOrDefault(groupe, 0);

            if (demandes > dons * 1.5) {
                recommandations.append("⚠️ Organiser une campagne pour le groupe ")
                        .append(groupe).append("\n");
            }
        }

        Double tauxSatisfaction = getTauxSatisfaction(
                hopitalId,
                LocalDate.now().minusMonths(1),
                LocalDate.now()
        );

        if (tauxSatisfaction < 70) {
            recommandations.append("📉 Améliorer la gestion des stocks (taux satisfaction: ")
                    .append(String.format("%.1f", tauxSatisfaction)).append("%)\n");
        }

        return recommandations.toString();
    }
}
