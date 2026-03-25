package com.bks.service;

import com.bks.dto.BadgeResponse;
import com.bks.enums.NiveauBadge;
import com.bks.enums.PrioriteNotification;
import com.bks.enums.TypeNotification;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GamificationService {

    private final BadgeRepository badgeRepository;
    private final DonneurBadgeRepository donneurBadgeRepository;
    private final DonneurRepository donneurRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    public GamificationService(BadgeRepository badgeRepository,
                               DonneurBadgeRepository donneurBadgeRepository,
                               DonneurRepository donneurRepository,
                               UtilisateurRepository utilisateurRepository,
                               NotificationService notificationService) {
        this.badgeRepository = badgeRepository;
        this.donneurBadgeRepository = donneurBadgeRepository;
        this.donneurRepository = donneurRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public void initialiserBadges() {
        if (badgeRepository.count() > 0) {
            return;
        }

        createAndSaveBadge("Donneur Bronze", "Première contribution - 1 don de sang", NiveauBadge.BRONZE, 1, 10);
        createAndSaveBadge("Donneur Argent", "Engagement confirmé - 3 dons de sang", NiveauBadge.ARGENT, 3, 30);
        createAndSaveBadge("Donneur Or", "Contributeur régulier - 5 dons de sang", NiveauBadge.OR, 5, 50);
        createAndSaveBadge("Donneur Platine", "Expert du don - 10 dons de sang", NiveauBadge.PLATINE, 10, 100);
        createAndSaveBadge("Donneur Diamant", "Héros sauveur de vies - 20 dons de sang", NiveauBadge.DIAMANT, 20, 200);
        createAndSaveBadge("Héros du Sang", "Champion du don - 50 dons de sang", NiveauBadge.HERO, 50, 500);
        createAndSaveBadge("Légende Vivante", "Engagement exceptionnel - 100 dons de sang", NiveauBadge.LEGENDE, 100, 1000);
        createAndSaveBadge("Champion Ultime", "Plus haut niveau atteint - 200+ dons de sang", NiveauBadge.CHAMPION, 200, 2000);

        System.out.println("✅ Badges initialisés avec succès!");
    }

    private void createAndSaveBadge(String nom, String description, NiveauBadge niveau, int donsRequis, int points) {
        Badge badge = new Badge();
        badge.setNom(nom);
        badge.setDescription(description);
        badge.setNiveau(niveau);
        badge.setNombreDonsRequis(donsRequis);
        badge.setPointsAttribues(points);
        badge.setActif(true);
        badgeRepository.save(badge);
    }

    @Transactional
    public void attribuerPoints(Long donneurId, Integer points) {
        Donneur donneur = donneurRepository.findById(donneurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));

        Utilisateur utilisateur = donneur.getUtilisateur();
        utilisateur.setPointsTotal(utilisateur.getPointsTotal() + points);
        utilisateurRepository.save(utilisateur);
    }

    @Transactional
    public void verifierEtAttribuerBadges(Long donneurId) {
        Donneur donneur = donneurRepository.findById(donneurId)
                .orElseThrow(() -> new RuntimeException("Donneur non trouvé"));

        Integer nombreDons = donneur.getNombreDonsTotal();
        List<Badge> badges = badgeRepository.findByActifTrue();

        for (Badge badge : badges) {
            if (nombreDons >= badge.getNombreDonsRequis() &&
                donneurBadgeRepository.findByDonneurIdAndBadgeId(donneurId, badge.getId()).isEmpty()) {
                
                DonneurBadge donneurBadge = new DonneurBadge();
                donneurBadge.setDonneur(donneur);
                donneurBadge.setBadge(badge);
                donneurBadge.setDateObtention(LocalDateTime.now());
                donneurBadge.setAffiche(true);
                donneurBadgeRepository.save(donneurBadge);

                attribuerPoints(donneurId, badge.getPointsAttribues());

                notificationService.envoyerNotificationUtilisateur(
                        donneur.getUtilisateur().getId(),
                        "🏆 Nouveau Badge Obtenu!",
                        "Félicitations! Vous avez obtenu le badge: " + badge.getNom(),
                        TypeNotification.SUCCES,
                        PrioriteNotification.NORMALE
                );
            }
        }
    }

    public List<BadgeResponse> getBadgesDonneur(Long donneurId) {
        return donneurBadgeRepository.findByDonneurId(donneurId)
                .stream()
                .map(this::mapToBadgeResponse)
                .collect(Collectors.toList());
    }

    private BadgeResponse mapToBadgeResponse(DonneurBadge db) {
        Badge badge = db.getBadge();
        BadgeResponse response = new BadgeResponse();
        response.setId(badge.getId());
        response.setNom(badge.getNom());
        response.setDescription(badge.getDescription());
        response.setNiveau(badge.getNiveau());
        response.setIconeUrl(badge.getIconeUrl());
        response.setNombreDonsRequis(badge.getNombreDonsRequis());
        response.setPointsAttribues(badge.getPointsAttribues());
        response.setDateObtention(db.getDateObtention());
        response.setObtenu(true);
        return response;
    }
}