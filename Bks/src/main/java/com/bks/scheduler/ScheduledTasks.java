package com.bks.scheduler;

import com.bks.enums.*;
import com.bks.model.*;
import com.bks.repository.*;
import com.bks.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Component
public class ScheduledTasks {

    @Autowired
    private DonRepository donRepository;

    @Autowired
    private StockSangRepository stockRepository;

    @Autowired
    private StockService stockService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private DonneurRepository donneurRepository;

    @Autowired
    private DemandeSangRepository demandeRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private CampagneService campagneService;

    // ========== SUPPRESSION DONS PÉRIMÉS - QUOTIDIEN 2H DU MATIN ==========
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void supprimerDonsPerimes() {
        System.out.println("🕐 [SCHEDULER] Vérification des dons périmés...");

        LocalDateTime limitePeremption = LocalDateTime.now();
        List<Don> donsPerimes = donRepository.findDonsPerimes(limitePeremption);

        for (Don don : donsPerimes) {
            don.setStatut(StatutDon.PERIME);
            donRepository.save(don);

            System.out.println("❌ Don périmé: " + don.getNumeroPoche() +
                    " - Groupe: " + don.getDonneur().getGroupeSanguin());
        }

        System.out.println("✅ " + donsPerimes.size() + " dons marqués comme périmés");
    }

    // ========== VÉRIFICATION STOCKS CRITIQUES - TOUTES LES HEURES ==========
    @Scheduled(fixedRate = 3600000) // Toutes les heures
    public void verifierStocksCritiques() {
        System.out.println("🕐 [SCHEDULER] Vérification des stocks critiques...");

        List<StockSang> stocksCritiques = stockRepository.findStocksCritiquesOuAlerte();

        for (StockSang stock : stocksCritiques) {
            String niveau = stock.getNiveauStock() == NiveauStock.CRITIQUE ?
                    "🚨 CRITIQUE" : "⚠️ ALERTE";

            notificationService.envoyerNotificationHopital(
                    stock.getHopital().getId(),
                    niveau + " Stock " + stock.getGroupeSanguin(),
                    "Le stock de " + stock.getGroupeSanguin() + " est à " +
                            stock.getQuantiteDisponible() + " ml (seuil: " +
                            stock.getSeuilAlerte() + " ml)",
                    stock.getNiveauStock() == NiveauStock.CRITIQUE ?
                            TypeNotification.URGENCE : TypeNotification.ALERTE,
                    stock.getNiveauStock() == NiveauStock.CRITIQUE ?
                            PrioriteNotification.CRITIQUE : PrioriteNotification.HAUTE
            );

            System.out.println(niveau + " - Hôpital: " + stock.getHopital().getNom() +
                    " - Groupe: " + stock.getGroupeSanguin() +
                    " - Quantité: " + stock.getQuantiteDisponible() + " ml");
        }

        System.out.println("✅ " + stocksCritiques.size() + " alertes de stock envoyées");
    }

    // ========== RAPPELS DONNEURS ÉLIGIBLES - HEBDOMADAIRE (DIMANCHE 10H) ==========
    @Scheduled(cron = "0 0 10 * * SUN")
    @Transactional
    public void rappelerDonneursEligibles() {
        System.out.println("🕐 [SCHEDULER] Envoi de rappels aux donneurs éligibles...");

        LocalDate aujourdhui = LocalDate.now();
        List<Donneur> donneursEligibles = donneurRepository
                .findDonneursEligiblesAvant(aujourdhui);

        for (Donneur donneur : donneursEligibles) {
            notificationService.envoyerNotificationUtilisateur(
                    donneur.getUtilisateur().getId(),
                    "💉 Vous êtes éligible pour un nouveau don!",
                    "Bonjour " + donneur.getUtilisateur().getPrenom() +
                            ", vous pouvez maintenant faire un nouveau don de sang. " +
                            "Votre contribution sauve des vies! 🩸",
                    TypeNotification.RAPPEL,
                    PrioriteNotification.NORMALE
            );

            System.out.println("📧 Rappel envoyé à: " + donneur.getUtilisateur().getEmail());
        }

        System.out.println("✅ " + donneursEligibles.size() + " rappels envoyés");
    }

    // ========== GÉNÉRATION STATISTIQUES QUOTIDIENNES - QUOTIDIEN 1H DU MATIN ==========
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void genererStatistiquesQuotidiennes() {
        System.out.println("🕐 [SCHEDULER] Génération des statistiques quotidiennes...");

        LocalDate hier = LocalDate.now().minusDays(1);
        List<Hopital> hopitaux = hopitalRepository.findByStatut(StatutHopital.VALIDE);

        for (Hopital hopital : hopitaux) {
            try {
                analyticsService.genererStatistiquesQuotidiennes(hopital.getId(), hier);
                System.out.println("📊 Stats générées pour: " + hopital.getNom());
            } catch (Exception e) {
                System.err.println("❌ Erreur stats pour " + hopital.getNom() + ": " + e.getMessage());
            }
        }

        System.out.println("✅ Statistiques quotidiennes générées pour " + hopitaux.size() + " hôpitaux");
    }

    // ========== NETTOYAGE NOTIFICATIONS EXPIRÉES - QUOTIDIEN 3H DU MATIN ==========
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void nettoyerNotificationsExpirees() {
        System.out.println("🕐 [SCHEDULER] Nettoyage des notifications expirées...");

        notificationService.supprimerNotificationsExpirees();

        System.out.println("✅ Notifications expirées supprimées");
    }

    // ========== ALERTES DEMANDES URGENTES - TOUTES LES 30 MINUTES ==========
    @Scheduled(fixedRate = 1800000) // 30 minutes
    public void alerterDemandesUrgentes() {
        System.out.println("🕐 [SCHEDULER] Vérification des demandes urgentes...");

        List<DemandeSang> demandesUrgentes = demandeRepository.findDemandesUrgentes();

        for (DemandeSang demande : demandesUrgentes) {
            // Alerte si la demande a plus de 2 heures
            if (demande.getDateDemande().isBefore(LocalDateTime.now().minusHours(2))) {
                notificationService.envoyerNotificationHopital(
                        demande.getHopital().getId(),
                        "🚨 DEMANDE URGENTE NON TRAITÉE",
                        "La demande #" + demande.getId() + " pour " +
                                demande.getGroupeSanguinDemande() + " (" +
                                demande.getQuantiteDemandee() + " ml) attend depuis " +
                                "plus de 2 heures!",
                        TypeNotification.URGENCE,
                        PrioriteNotification.CRITIQUE
                );

                System.out.println("🚨 Alerte urgence: Demande #" + demande.getId() +
                        " - " + demande.getHopital().getNom());
            }
        }

        System.out.println("✅ " + demandesUrgentes.size() + " demandes urgentes vérifiées");
    }

    // ========== MISE À JOUR STATUTS CAMPAGNES - TOUTES LES 6 HEURES ==========
    @Scheduled(fixedRate = 21600000) // 6 heures
    @Transactional
    public void mettreAJourCampagnes() {
        System.out.println("🕐 [SCHEDULER] Mise à jour des statuts des campagnes...");

        campagneService.mettreAJourStatutCampagnes();

        System.out.println("✅ Statuts des campagnes mis à jour");
    }

    // ========== RAPPORT HEBDOMADAIRE - DIMANCHE 20H ==========
    @Scheduled(cron = "0 0 20 * * SUN")
    @Transactional
    public void genererRapportHebdomadaire() {
        System.out.println("🕐 [SCHEDULER] Génération du rapport hebdomadaire...");

        List<Hopital> hopitaux = hopitalRepository.findByStatut(StatutHopital.VALIDE);

        for (Hopital hopital : hopitaux) {
            String recommandations = analyticsService.genererRecommandations(hopital.getId());

            if (!recommandations.isEmpty()) {
                notificationService.envoyerNotificationHopital(
                        hopital.getId(),
                        "📊 Rapport Hebdomadaire",
                        "Voici vos recommandations pour la semaine:\n\n" + recommandations,
                        TypeNotification.INFO,
                        PrioriteNotification.NORMALE
                );

                System.out.println("📧 Rapport envoyé à: " + hopital.getNom());
            }
        }

        System.out.println("✅ Rapports hebdomadaires envoyés");
    }

    // ========== INITIALISATION BADGES - AU DÉMARRAGE ==========
    @Autowired
    private GamificationService gamificationService;

    @Scheduled(initialDelay = 5000, fixedDelay = Long.MAX_VALUE)
    @Transactional
    public void initialiserBadges() {
        System.out.println("🕐 [SCHEDULER] Initialisation des badges...");
        gamificationService.initialiserBadges();
        System.out.println("✅ Badges initialisés");
    }
}