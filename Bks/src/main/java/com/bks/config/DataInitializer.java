package com.bks.config;

import com.bks.enums.*;
import com.bks.model.*;
import com.bks.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Initializes the database with sample data on application startup.
 * Only creates data that doesn't already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final HopitalRepository hopitalRepository;
    private final DonneurRepository donneurRepository;
    private final StockSangRepository stockSangRepository;
    private final BadgeRepository badgeRepository;
    private final DonRepository donRepository;
    private final DemandeSangRepository demandeSangRepository;
    private final NotificationRepository notificationRepository;
    private final CampagneDonRepository campagneDonRepository;
    private final CandidatureDemandRepository candidatureDemandRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("🚀 Vérification et initialisation des données de démonstration...");

        boolean badgesCreated = initBadges();
        boolean hopitauxCreated = initHopitaux();
        boolean superAdminCreated = initSuperAdmin();
        boolean adminsCreated = initAdmins();
        boolean usersCreated = initUsers();
        boolean donneursCreated = initDonneurs();
        boolean stocksCreated = initStocks();
        boolean donsCreated = initDons();
        boolean demandesCreated = initDemandes();
        boolean notificationsCreated = initNotifications();
        boolean campagnesCreated = initCampagnes();
        boolean candidaturesCreated = initCandidatures();

        if (!badgesCreated && !hopitauxCreated && !superAdminCreated && !adminsCreated && !usersCreated 
            && !donneursCreated && !stocksCreated && !donsCreated && !demandesCreated 
            && !notificationsCreated && !campagnesCreated && !candidaturesCreated) {
            log.info("📦 Données de démonstration déjà présentes.");
            return;
        }

        log.info("✅ Initialisation terminée avec succès!");
        log.info("📊 Résumé des données créées:");
        log.info("   - Hôpitaux: {}", hopitalRepository.count());
        log.info("   - Utilisateurs: {}", utilisateurRepository.count());
        log.info("   - Donneurs: {}", donneurRepository.count());
        log.info("   - Dons: {}", donRepository.count());
        log.info("   - Demandes: {}", demandeSangRepository.count());
        log.info("   - Stocks: {}", stockSangRepository.count());
        log.info("   - Campagnes: {}", campagneDonRepository.count());
        log.info("   - Notifications: {}", notificationRepository.count());
        log.info("   - Badges: {}", badgeRepository.count());
        log.info("📧 Comptes disponibles:");
        log.info("   - Super Admin: superadmin@bks.com / admin123");
        log.info("   - Admin CHU Casablanca: admin.casa@bks.com / admin123");
        log.info("   - Admin CHU Rabat: admin.rabat@bks.com / admin123");
        log.info("   - Donneur: donneur1@test.com / user123");
    }

    private boolean initBadges() {
        if (badgeRepository.count() > 0) {
            return false;
        }
        
        log.info("🏅 Création des badges...");

        List<Badge> badges = List.of(
            createBadge("Premier Don", "Félicitations pour votre premier don!", NiveauBadge.BRONZE, 1, 10),
            createBadge("Donneur Régulier", "5 dons effectués", NiveauBadge.ARGENT, 5, 50),
            createBadge("Donneur Fidèle", "10 dons effectués", NiveauBadge.OR, 10, 100),
            createBadge("Donneur Expert", "25 dons effectués", NiveauBadge.PLATINE, 25, 250),
            createBadge("Héros du Sang", "50 dons effectués", NiveauBadge.DIAMANT, 50, 500),
            createBadge("Légende", "100 dons effectués", NiveauBadge.LEGENDE, 100, 1000),
            createBadge("Champion de Vie", "Donneur d'exception", NiveauBadge.CHAMPION, 150, 2000)
        );

        badgeRepository.saveAll(badges);
        return true;
    }

    private Badge createBadge(String nom, String description, NiveauBadge niveau, int donsRequis, int points) {
        Badge badge = new Badge();
        badge.setNom(nom);
        badge.setDescription(description);
        badge.setNiveau(niveau);
        badge.setNombreDonsRequis(donsRequis);
        badge.setPointsAttribues(points);
        badge.setActif(true);
        badge.setConditionObtention(donsRequis + " dons effectués");
        return badge;
    }

    private boolean initHopitaux() {
        if (hopitalRepository.count() > 0) {
            return false;
        }
        
        log.info("🏥 Création des hôpitaux...");

        Hopital chu1 = new Hopital();
        chu1.setNom("CHU Ibn Rochd Casablanca");
        chu1.setAdresse("Quartier des Hôpitaux");
        chu1.setVille("Casablanca");
        chu1.setRegion("Casablanca-Settat");
        chu1.setTelephone("0522222222");
        chu1.setEmail("contact@chu-casablanca.ma");
        chu1.setStatut(StatutHopital.VALIDE);
        chu1.setCapaciteStockage(10000);
        chu1.setCertifie(true);
        chu1.setDescription("Centre Hospitalier Universitaire Ibn Rochd de Casablanca");
        chu1.setDateValidation(LocalDateTime.now());

        Hopital chu2 = new Hopital();
        chu2.setNom("CHU Ibn Sina Rabat");
        chu2.setAdresse("Avenue Ibn Sina");
        chu2.setVille("Rabat");
        chu2.setRegion("Rabat-Salé-Kénitra");
        chu2.setTelephone("0537777777");
        chu2.setEmail("contact@chu-rabat.ma");
        chu2.setStatut(StatutHopital.VALIDE);
        chu2.setCapaciteStockage(8000);
        chu2.setCertifie(true);
        chu2.setDescription("Centre Hospitalier Universitaire Ibn Sina de Rabat");
        chu2.setDateValidation(LocalDateTime.now());

        Hopital hopital3 = new Hopital();
        hopital3.setNom("Hôpital Régional Marrakech");
        hopital3.setAdresse("Avenue Mohammed VI");
        hopital3.setVille("Marrakech");
        hopital3.setRegion("Marrakech-Safi");
        hopital3.setTelephone("0524444444");
        hopital3.setEmail("contact@hopital-marrakech.ma");
        hopital3.setStatut(StatutHopital.VALIDE);
        hopital3.setCapaciteStockage(5000);
        hopital3.setCertifie(false);
        hopital3.setDescription("Hôpital Régional de Marrakech");
        hopital3.setDateValidation(LocalDateTime.now());

        Hopital hopital4 = new Hopital();
        hopital4.setNom("Clinique Privée Tanger");
        hopital4.setAdresse("Boulevard Pasteur");
        hopital4.setVille("Tanger");
        hopital4.setRegion("Tanger-Tétouan-Al Hoceïma");
        hopital4.setTelephone("0539333333");
        hopital4.setEmail("contact@clinique-tanger.ma");
        hopital4.setStatut(StatutHopital.EN_ATTENTE);
        hopital4.setCapaciteStockage(3000);
        hopital4.setDescription("Clinique privée en attente de validation");

        hopitalRepository.saveAll(List.of(chu1, chu2, hopital3, hopital4));
        return true;
    }

    private boolean initSuperAdmin() {
        if (utilisateurRepository.findByEmail("superadmin@bks.com").isPresent()) {
            return false;
        }
        
        log.info("👑 Création du Super Admin...");

        Utilisateur superAdmin = new Utilisateur();
        superAdmin.setEmail("superadmin@bks.com");
        superAdmin.setMotDePasse(passwordEncoder.encode("admin123"));
        superAdmin.setNom("Administrateur");
        superAdmin.setPrenom("Super");
        superAdmin.setTelephone("0600000000");
        superAdmin.setRole(Role.SUPER_ADMIN);
        superAdmin.setActif(true);
        superAdmin.setDateCreation(LocalDateTime.now());

        utilisateurRepository.save(superAdmin);
        return true;
    }

    private boolean initAdmins() {
        boolean created = false;
        List<Hopital> hopitaux = hopitalRepository.findAll();
        
        if (hopitaux.isEmpty()) {
            return false;
        }

        if (utilisateurRepository.findByEmail("admin.casa@bks.com").isEmpty()) {
            log.info("👤 Création admin CHU Casablanca...");
            Utilisateur admin1 = new Utilisateur();
            admin1.setEmail("admin.casa@bks.com");
            admin1.setMotDePasse(passwordEncoder.encode("admin123"));
            admin1.setNom("Benali");
            admin1.setPrenom("Ahmed");
            admin1.setTelephone("0611111111");
            admin1.setRole(Role.ADMIN);
            admin1.setHopital(hopitaux.stream().filter(h -> h.getNom().contains("Casablanca")).findFirst().orElse(hopitaux.get(0)));
            admin1.setActif(true);
            admin1.setDateCreation(LocalDateTime.now());
            utilisateurRepository.save(admin1);
            created = true;
        }

        if (utilisateurRepository.findByEmail("admin.rabat@bks.com").isEmpty()) {
            log.info("👤 Création admin CHU Rabat...");
            Utilisateur admin2 = new Utilisateur();
            admin2.setEmail("admin.rabat@bks.com");
            admin2.setMotDePasse(passwordEncoder.encode("admin123"));
            admin2.setNom("El Amrani");
            admin2.setPrenom("Fatima");
            admin2.setTelephone("0622222222");
            admin2.setRole(Role.ADMIN);
            admin2.setHopital(hopitaux.stream().filter(h -> h.getNom().contains("Rabat")).findFirst().orElse(hopitaux.get(0)));
            admin2.setActif(true);
            admin2.setDateCreation(LocalDateTime.now());
            utilisateurRepository.save(admin2);
            created = true;
        }

        if (utilisateurRepository.findByEmail("admin.marrakech@bks.com").isEmpty()) {
            log.info("👤 Création admin Marrakech...");
            Utilisateur admin3 = new Utilisateur();
            admin3.setEmail("admin.marrakech@bks.com");
            admin3.setMotDePasse(passwordEncoder.encode("admin123"));
            admin3.setNom("Saidi");
            admin3.setPrenom("Youssef");
            admin3.setTelephone("0633333333");
            admin3.setRole(Role.ADMIN);
            admin3.setHopital(hopitaux.stream().filter(h -> h.getNom().contains("Marrakech")).findFirst().orElse(hopitaux.get(0)));
            admin3.setActif(true);
            admin3.setDateCreation(LocalDateTime.now());
            utilisateurRepository.save(admin3);
            created = true;
        }

        return created;
    }

    private boolean initUsers() {
        boolean created = false;
        
        String[][] usersData = {
            {"donneur1@test.com", "Martin", "Pierre", "0644444444", "150"},
            {"donneur2@test.com", "Alaoui", "Khadija", "0655555555", "75"},
            {"donneur3@test.com", "Tazi", "Omar", "0666666666", "300"},
            {"donneur4@test.com", "Berrada", "Salma", "0677777777", "50"}
        };

        for (String[] data : usersData) {
            if (utilisateurRepository.findByEmail(data[0]).isEmpty()) {
                log.info("👥 Création utilisateur {}...", data[0]);
                Utilisateur user = new Utilisateur();
                user.setEmail(data[0]);
                user.setMotDePasse(passwordEncoder.encode("user123"));
                user.setNom(data[1]);
                user.setPrenom(data[2]);
                user.setTelephone(data[3]);
                user.setRole(Role.USER);
                user.setActif(true);
                user.setPointsTotal(Integer.parseInt(data[4]));
                user.setDateCreation(LocalDateTime.now());
                utilisateurRepository.save(user);
                created = true;
            }
        }

        return created;
    }

    private boolean initDonneurs() {
        boolean created = false;
        Object[][] donneursData = {
            {"donneur1@test.com", "AB123456", LocalDate.of(1990, 5, 15), GroupeSanguin.O_POSITIF, Sexe.HOMME, "123 Rue Hassan II", "Casablanca", 75.0, 3},
            {"donneur2@test.com", "CD789012", LocalDate.of(1988, 8, 22), GroupeSanguin.A_POSITIF, Sexe.FEMME, "456 Avenue Mohammed V", "Rabat", 62.0, 2},
            {"donneur3@test.com", "EF345678", LocalDate.of(1985, 3, 10), GroupeSanguin.B_NEGATIF, Sexe.HOMME, "789 Boulevard Zerktouni", "Casablanca", 82.0, 8},
            {"donneur4@test.com", "GH901234", LocalDate.of(1995, 11, 28), GroupeSanguin.AB_POSITIF, Sexe.FEMME, "321 Rue Ibn Batouta", "Marrakech", 58.0, 1}
        };

        for (Object[] data : donneursData) {
            String email = (String) data[0];
            String cin = (String) data[1];
            
            Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(email);
            if (userOpt.isEmpty()) continue;
            
            Utilisateur user = userOpt.get();
            if (donneurRepository.findByUtilisateur(user).isPresent()) continue;
            
            log.info("🩸 Création profil donneur pour {}...", email);
            
            Donneur donneur = new Donneur();
            donneur.setUtilisateur(user);
            donneur.setCin(cin);
            donneur.setDateNaissance((LocalDate) data[2]);
            donneur.setGroupeSanguin((GroupeSanguin) data[3]);
            donneur.setSexe((Sexe) data[4]);
            donneur.setAdresse((String) data[5]);
            donneur.setVille((String) data[6]);
            donneur.setPoids((Double) data[7]);
            donneur.setEligible(true);
            donneur.setNombreDonsTotal((Integer) data[8]);
            donneur.setDateDernierDon(LocalDate.now().minusMonths(4));
            donneur.setDateProchaineEligibilite(LocalDate.now().minusMonths(1));
            donneur.setAntecedentsMedicaux("Aucun");
            
            donneurRepository.save(donneur);
            created = true;
        }
        return created;
    }

    private boolean initStocks() {
        List<Hopital> hopitaux = hopitalRepository.findAll().stream()
            .filter(h -> h.getStatut() == StatutHopital.VALIDE)
            .toList();

        for (Hopital hopital : hopitaux) {
            for (GroupeSanguin groupe : GroupeSanguin.values()) {
                if (stockSangRepository.findByHopitalAndGroupeSanguin(hopital, groupe).isPresent()) {
                    continue;
                }
                
                log.info("📊 Création stock {} pour {}...", groupe, hopital.getNom());
                
                StockSang stock = new StockSang();
                stock.setHopital(hopital);
                stock.setGroupeSanguin(groupe);

                int baseQuantity = switch (groupe) {
                    case O_POSITIF -> 8000;
                    case A_POSITIF -> 6000;
                    case B_POSITIF -> 4000;
                    case AB_POSITIF -> 2000;
                    case O_NEGATIF -> 3000;
                    case A_NEGATIF -> 2500;
                    case B_NEGATIF -> 1500;
                    case AB_NEGATIF -> 800;
                };

                int hopitalIndex = hopitaux.indexOf(hopital);
                int quantity = (int) (baseQuantity * (0.7 + (hopitalIndex * 0.15)));
                stock.setQuantiteDisponible(quantity);
                stock.setNombrePoches(quantity / 450);
                stock.setDerniereMiseAJour(LocalDateTime.now());
                stock.calculerNiveauStock();

                stockSangRepository.save(stock);
            }
        }
        return true;
    }
    
    private boolean initDons() {
        if (donRepository.count() > 0) {
            return false;
        }
        
        log.info("🩸 Création des dons de sang...");
        
        List<Hopital> hopitaux = hopitalRepository.findAll();
        List<Donneur> donneurs = donneurRepository.findAll();
        List<Utilisateur> admins = utilisateurRepository.findByRole(Role.ADMIN);
        
        if (hopitaux.isEmpty() || donneurs.isEmpty()) {
            return false;
        }
        
        Hopital hopital = hopitaux.get(0);
        Long adminId = admins.isEmpty() ? null : admins.get(0).getId();
        
        // Create 30 validated donations
        for (int i = 0; i < Math.min(30, donneurs.size()); i++) {
            Donneur donneur = donneurs.get(i);
            Don don = new Don();
            don.setDonneur(donneur);
            don.setHopital(hopital);
            don.setStatut(StatutDon.VALIDE);
            don.setDateDon(LocalDateTime.now().minusDays(i + 1));
            don.setQuantiteMl(450);
            don.setNumeroPoche("POCH-" + String.format("%03d", i + 1));
            don.setDatePeremption(LocalDateTime.now().plusDays(42 - i));
            if (adminId != null) {
                don.setValideParId(adminId);
                don.setDateValidation(LocalDateTime.now().minusDays(i + 1));
            }
            donRepository.save(don);
        }
        
        // Create 5 pending donations
        for (int i = 0; i < 5 && i < donneurs.size(); i++) {
            Donneur donneur = donneurs.get(i);
            Don don = new Don();
            don.setDonneur(donneur);
            don.setHopital(hopital);
            don.setStatut(StatutDon.EN_ATTENTE);
            don.setDateDon(LocalDateTime.now().minusHours(i + 1));
            don.setQuantiteMl(450);
            don.setNumeroPoche("POCH-PEND-" + String.format("%03d", i + 1));
            donRepository.save(don);
        }
        
        return true;
    }
    
    private boolean initDemandes() {
        if (demandeSangRepository.count() > 0) {
            return false;
        }
        
        log.info("📋 Création des demandes de sang...");
        
        List<Hopital> hopitaux = hopitalRepository.findAll();
        List<Utilisateur> admins = utilisateurRepository.findByRole(Role.ADMIN);
        
        if (hopitaux.isEmpty()) {
            return false;
        }
        
        Hopital hopital = hopitaux.get(0);
        Long adminId = admins.isEmpty() ? null : admins.get(0).getId();
        
        Object[][] demandesData = {
            {GroupeSanguin.O_NEGATIF, 900, Urgence.CRITIQUE, StatutDemande.EN_ATTENTE, "Chirurgie cardiaque urgente", null},
            {GroupeSanguin.AB_NEGATIF, 450, Urgence.CRITIQUE, StatutDemande.EN_ATTENTE, "Accident de la route", null},
            {GroupeSanguin.O_POSITIF, 1350, Urgence.HAUTE, StatutDemande.EN_ATTENTE, "Transfusion urgente", null},
            {GroupeSanguin.A_NEGATIF, 900, Urgence.CRITIQUE, StatutDemande.EN_COURS, "Chirurgie d'urgence", adminId},
            {GroupeSanguin.B_POSITIF, 450, Urgence.NORMALE, StatutDemande.EN_ATTENTE, "Transfusion programmée", null},
            {GroupeSanguin.AB_POSITIF, 450, Urgence.NORMALE, StatutDemande.EN_ATTENTE, "Anémie sévère", null},
            {GroupeSanguin.O_POSITIF, 900, Urgence.HAUTE, StatutDemande.EN_COURS, "Transfusion urgente", adminId},
            {GroupeSanguin.A_POSITIF, 450, Urgence.NORMALE, StatutDemande.EN_ATTENTE, "Chimiothérapie", null},
            {GroupeSanguin.B_NEGATIF, 450, Urgence.CRITIQUE, StatutDemande.EN_ATTENTE, "Accident travail", null},
            {GroupeSanguin.O_NEGATIF, 1350, Urgence.HAUTE, StatutDemande.EN_COURS, "Césarienne urgente", adminId},
            {GroupeSanguin.A_NEGATIF, 900, Urgence.CRITIQUE, StatutDemande.ANNULEE, "Stock insuffisant", null},
            {GroupeSanguin.AB_NEGATIF, 450, Urgence.HAUTE, StatutDemande.EN_ATTENTE, "Maladie rare", null},
            {GroupeSanguin.O_POSITIF, 1800, Urgence.NORMALE, StatutDemande.EN_ATTENTE, "Opération programmée", null},
            {GroupeSanguin.A_POSITIF, 450, Urgence.NORMALE, StatutDemande.SATISFAITE, "Transfusion réussie", adminId},
            {GroupeSanguin.B_POSITIF, 1350, Urgence.HAUTE, StatutDemande.EN_ATTENTE, "Leucémie", null},
            {GroupeSanguin.AB_POSITIF, 900, Urgence.NORMALE, StatutDemande.EN_ATTENTE, "Thalassémie", null},
            {GroupeSanguin.O_NEGATIF, 450, Urgence.CRITIQUE, StatutDemande.SATISFAITE, "Traumatisme crânien", adminId},
            {GroupeSanguin.A_POSITIF, 1350, Urgence.HAUTE, StatutDemande.EN_ATTENTE, "Hémophilie", null},
        };
        
        for (int i = 0; i < demandesData.length; i++) {
            Object[] data = demandesData[i];
            DemandeSang demande = new DemandeSang();
            demande.setHopital(hopital);
            demande.setGroupeSanguinDemande((GroupeSanguin) data[0]);
            demande.setQuantiteDemandee((Integer) data[1]);
            demande.setUrgence((Urgence) data[2]);
            demande.setStatut((StatutDemande) data[3]);
            demande.setDateDemande(LocalDateTime.now().minusHours(i + 1));
            demande.setDateBesoin(LocalDateTime.now().plusHours(24 - i));
            demande.setNomPatient("Patient" + (i + 1));
            demande.setPrenomPatient("Prenom" + (i + 1));
            demande.setNotes((String) data[4]);
            demande.setDiagnostic("Transfusion sanguine urgente");
            demande.setMedecinPrescripteur("Dr. Martin");
            if (data[5] != null) {
                demande.setTraiteeParId((Long) data[5]);
                demande.setDateTraitement(LocalDateTime.now().minusHours(i));
            }
            demandeSangRepository.save(demande);
        }
        
        return true;
    }
    
    private boolean initNotifications() {
        if (notificationRepository.count() > 0) {
            return false;
        }
        
        log.info("🔔 Création des notifications...");
        
        List<Utilisateur> admins = utilisateurRepository.findByRole(Role.ADMIN);
        List<Hopital> hopitaux = hopitalRepository.findAll();
        
        if (admins.isEmpty() || hopitaux.isEmpty()) {
            return false;
        }
        
        Utilisateur admin = admins.get(0);
        Hopital hopital = hopitaux.get(0);
        
        Object[][] notificationsData = {
            {"Alerte Stock Critique", "Stock O- descendu sous seuil critique", TypeNotification.ALERTE, PrioriteNotification.HAUTE},
            {"Alerte Stock Critique", "Stock AB- en état critique", TypeNotification.URGENCE, PrioriteNotification.CRITIQUE},
            {"Nouveau don validé", "Don de Jean Martin validé - 450ml O+", TypeNotification.SUCCES, PrioriteNotification.NORMALE},
            {"Dons en attente", "5 dons sont en attente de validation", TypeNotification.ALERTE, PrioriteNotification.HAUTE},
            {"Nouvelle demande urgente", "Demande O- critique pour Patient1", TypeNotification.URGENCE, PrioriteNotification.CRITIQUE},
            {"Demande validée", "Demande A- validée et servie", TypeNotification.SUCCES, PrioriteNotification.NORMALE},
            {"Campagne terminée", "Collecte: 67/80 poches collectées", TypeNotification.INFO, PrioriteNotification.NORMALE},
            {"Poches à périr", "5 poches arrivent à expiration", TypeNotification.ALERTE, PrioriteNotification.HAUTE},
            {"Nouveau donneur", "3 nouveaux donneurs enregistrés", TypeNotification.INFO, PrioriteNotification.BASSE},
            {"Urgence non satisfaite", "Demande AB- critique toujours en attente", TypeNotification.URGENCE, PrioriteNotification.CRITIQUE},
            {"Don programmé", "Rappel: 2 dons programmés demain", TypeNotification.RAPPEL, PrioriteNotification.NORMALE},
            {"Maintenance système", "Maintenance prévue ce soir", TypeNotification.SYSTEME, PrioriteNotification.NORMALE},
            {"Statistiques mensuelles", "Rapport de juin disponible", TypeNotification.INFO, PrioriteNotification.NORMALE},
            {"Transfert de stock", "Demande de transfert O- reçue", TypeNotification.ALERTE, PrioriteNotification.HAUTE},
            {"Badge attribué", "Donneur Fidèle attribué", TypeNotification.SUCCES, PrioriteNotification.NORMALE},
            {"Changement stock", "Stock B+ passé en niveau OPTIMAL", TypeNotification.INFO, PrioriteNotification.BASSE},
        };
        
        for (int i = 0; i < notificationsData.length; i++) {
            Object[] data = notificationsData[i];
            Notification notification = new Notification();
            notification.setDestinataire(admin);
            notification.setHopital(hopital);
            notification.setTitre((String) data[0]);
            notification.setMessage((String) data[1]);
            notification.setType((TypeNotification) data[2]);
            notification.setPriorite((PrioriteNotification) data[3]);
            notification.setDateCreation(LocalDateTime.now().minusMinutes(i * 15));
            notification.setLue(i > 8);
            notificationRepository.save(notification);
        }
        
        return true;
    }
    
    private boolean initCampagnes() {
        if (campagneDonRepository.count() > 0) {
            return false;
        }
        
        log.info("📢 Création des campagnes de don...");
        
        List<Hopital> hopitaux = hopitalRepository.findAll();
        List<Utilisateur> admins = utilisateurRepository.findByRole(Role.ADMIN);
        
        if (hopitaux.isEmpty() || admins.isEmpty()) {
            return false;
        }
        
        Hopital hopital = hopitaux.get(0);
        Long adminId = admins.get(0).getId();
        
        Object[][] campagnesData = {
            {"Grande collecte de printemps", "Venez nombreux pour sauver des vies!", LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(3), "Centre Commercial Paris Nord", 100, 0, StatutCampagne.PLANIFIEE, "Paris", "Île-de-France"},
            {"Marathon du sang", "24h de don continu avec animations", LocalDateTime.now().plusDays(5), LocalDateTime.now().plusDays(6), "Stade de France", 200, 0, StatutCampagne.PLANIFIEE, "Saint-Denis", "Île-de-France"},
            {"Campagne urgente O-", "Alerte rouge sur les stocks O négatif", LocalDateTime.now().minusDays(1), LocalDateTime.now().plusDays(7), "Hôpital Principal", 50, 12, StatutCampagne.EN_COURS, "Paris", "Île-de-France"},
            {"Don du sang entre collègues", "Collecte interne pour les entreprises", LocalDateTime.now().plusDays(10), LocalDateTime.now().plusDays(10), "Tour Eiffel", 75, 0, StatutCampagne.PLANIFIEE, "Paris", "Île-de-France"},
            {"Été solidaire", "Collecte estivale - besoins accrus", LocalDateTime.now().plusDays(14), LocalDateTime.now().plusDays(16), "Plage de Marseille", 150, 0, StatutCampagne.PLANIFIEE, "Marseille", "Provence"},
            {"Collecte universitaire", "Campagne dans les universités", LocalDateTime.now().minusDays(7), LocalDateTime.now().minusDays(2), "Université Paris-Saclay", 80, 67, StatutCampagne.TERMINEE, "Orsay", "Île-de-France"},
            {"Weekend du don", "Collecte le samedi et dimanche", LocalDateTime.now().plusDays(21), LocalDateTime.now().plusDays(22), "Mairie de Lyon", 120, 0, StatutCampagne.PLANIFIEE, "Lyon", "Auvergne-Rhône-Alpes"},
            {"Urgence AB-", "Appel aux donneurs AB négatif", LocalDateTime.now().minusDays(3), LocalDateTime.now().plusDays(4), "CHU Principal", 25, 18, StatutCampagne.EN_COURS, "Lyon", "Auvergne-Rhône-Alpes"},
        };
        
        for (Object[] data : campagnesData) {
            CampagneDon campagne = new CampagneDon();
            campagne.setTitre((String) data[0]);
            campagne.setDescription((String) data[1]);
            campagne.setDateDebut((LocalDateTime) data[2]);
            campagne.setDateFin((LocalDateTime) data[3]);
            campagne.setLieuCollecte((String) data[4]);
            campagne.setObjectifDonneurs((Integer) data[5]);
            campagne.setNombreParticipants((Integer) data[6]);
            campagne.setStatut((StatutCampagne) data[7]);
            campagne.setVille((String) data[8]);
            campagne.setRegion((String) data[9]);
            campagne.setHopital(hopital);
            campagne.setCreeeParId(adminId);
            campagne.setDateCreation(LocalDateTime.now());
            campagne.setNationale(false);
            campagneDonRepository.save(campagne);
        }
        
        return true;
    }
    
    private boolean initCandidatures() {
        if (candidatureDemandRepository.count() > 0) {
            return false;
        }
        
        log.info("📝 Création des candidatures...");
        
        List<DemandeSang> demandes = demandeSangRepository.findAll();
        List<Donneur> donneurs = donneurRepository.findAll();
        
        if (demandes.isEmpty() || donneurs.isEmpty()) {
            return false;
        }
        
        int count = 0;
        for (DemandeSang demande : demandes) {
            if (demande.getUrgence() == Urgence.CRITIQUE && demande.getStatut() == StatutDemande.EN_ATTENTE) {
                for (Donneur donneur : donneurs) {
                    if (donneur.getGroupeSanguin() == demande.getGroupeSanguinDemande() && count < 10) {
                        CandidatureDemande candidature = new CandidatureDemande();
                        candidature.setDemande(demande);
                        candidature.setDonneur(donneur);
                        candidature.setStatut(StatutCandidature.EN_ATTENTE);
                        candidature.setDateCandidature(LocalDateTime.now().minusMinutes(count * 30));
                        candidatureDemandRepository.save(candidature);
                        count++;
                        break;
                    }
                }
            }
        }
        
        return count > 0;
    }
}
