package com.bks.service;

import com.bks.dto.*;
import com.bks.enums.NiveauStock;
import com.bks.enums.StatutDemande;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private DonneurRepository donneurRepository;

    @Autowired
    private DonRepository donRepository;

    @Autowired
    private DemandeSangRepository demandeRepository;

    @Autowired
    private StockService stockService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DonneurService donneurService;

    public DashboardAnalytics getDashboardAdmin(Long hopitalId) {
        DashboardAnalytics analytics = new DashboardAnalytics();

        DashboardStats stats = new DashboardStats();

        var dons = donRepository.findByHopitalId(hopitalId);
        var demandes = demandeRepository.findByHopitalId(hopitalId);

        stats.setTotalDons(dons.size());
        stats.setTotalDemandes(demandes.size());
        stats.setDemandesPendantes((int) demandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.EN_ATTENTE)
                .count());

        LocalDateTime debutJour = LocalDate.now().atStartOfDay();
        stats.setDonsAujourdHui((int) dons.stream()
                .filter(d -> d.getDateDon().isAfter(debutJour))
                .count());

        stats.setDemandesAujourdHui((int) demandes.stream()
                .filter(d -> d.getDateDemande().isAfter(debutJour))
                .count());

        stats.setTauxSatisfaction(analyticsService.getTauxSatisfaction(
                hopitalId,
                LocalDate.now().minusMonths(1),
                LocalDate.now()
        ));

        var stocksCritiques = stockService.getStockParHopital(hopitalId).stream()
                .filter(s -> s.getNiveauStock() == NiveauStock.CRITIQUE ||
                        s.getNiveauStock() == NiveauStock.ALERTE)
                .toList();
        stats.setStocksCritiques(stocksCritiques.size());

        analytics.setStats(stats);
        analytics.setDonsParGroupe(analyticsService.getDonsParGroupe(hopitalId));
        analytics.setDemandesParGroupe(analyticsService.getDemandesParGroupe(hopitalId));
        analytics.setStocksCritiques(stocksCritiques);

        var demandesUrgentes = demandeRepository.findDemandesUrgentes().stream()
                .filter(d -> d.getHopital().getId().equals(hopitalId))
                .limit(5)
                .map(d -> {
                    DemandeSangResponse r = new DemandeSangResponse();
                    r.setId(d.getId());
                    r.setGroupeSanguinDemande(d.getGroupeSanguinDemande());
                    r.setQuantiteDemandee(d.getQuantiteDemandee());
                    r.setUrgence(d.getUrgence());
                    r.setNomPatient(d.getNomPatient());
                    return r;
                })
                .toList();
        analytics.setDemandesUrgentes(demandesUrgentes);

        analytics.setTopDonneurs(donneurService.getTopDonneurs(5));
        analytics.setEvolutionDons(analyticsService.getEvolutionDons(hopitalId, 3));

        return analytics;
    }

    public DashboardAnalytics getDashboardSuperAdmin() {
        DashboardAnalytics analytics = new DashboardAnalytics();

        DashboardStats stats = new DashboardStats();
        stats.setTotalDonneurs(donneurRepository.findAll().size());
        stats.setTotalDons((int) donRepository.count());
        stats.setTotalDemandes((int) demandeRepository.count());

        analytics.setStats(stats);
        analytics.setDonsParGroupe(analyticsService.getDonsParGroupe(null));
        analytics.setDemandesParGroupe(analyticsService.getDemandesParGroupe(null));
        analytics.setStocksCritiques(stockService.getStocksCritiques());
        analytics.setTopDonneurs(donneurService.getTopDonneurs(10));
        analytics.setEvolutionDons(analyticsService.getEvolutionDons(null, 6));

        return analytics;
    }
}