package com.bks.service;

import com.bks.enums.PrioriteNotification;
import com.bks.enums.Role;
import com.bks.enums.TypeNotification;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Transactional
    public void envoyerNotificationUtilisateur(
            Long utilisateurId,
            String titre,
            String message,
            TypeNotification type,
            PrioriteNotification priorite) {

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Notification notification = new Notification();
        notification.setDestinataire(utilisateur);
        notification.setTitre(titre);
        notification.setMessage(message);
        notification.setType(type);
        notification.setPriorite(priorite);
        notification.setGlobale(false);
        notification.setLue(false);
        notification.setDateCreation(LocalDateTime.now());
        notification.setDateExpiration(LocalDateTime.now().plusDays(30));

        notificationRepository.save(notification);
    }

    @Transactional
    public void envoyerNotificationHopital(
            Long hopitalId,
            String titre,
            String message,
            TypeNotification type,
            PrioriteNotification priorite) {

        Hopital hopital = hopitalRepository.findById(hopitalId)
                .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));

        List<Utilisateur> admins = utilisateurRepository.findByHopitalId(hopitalId);

        for (Utilisateur admin : admins) {
            Notification notification = new Notification();
            notification.setDestinataire(admin);
            notification.setHopital(hopital);
            notification.setTitre(titre);
            notification.setMessage(message);
            notification.setType(type);
            notification.setPriorite(priorite);
            notification.setGlobale(false);
            notification.setLue(false);
            notification.setDateCreation(LocalDateTime.now());
            notification.setDateExpiration(LocalDateTime.now().plusDays(30));

            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void envoyerNotificationRole(
            Role role,
            String titre,
            String message,
            TypeNotification type,
            PrioriteNotification priorite) {

        List<Utilisateur> utilisateurs = utilisateurRepository.findByRole(role);

        for (Utilisateur utilisateur : utilisateurs) {
            Notification notification = new Notification();
            notification.setDestinataire(utilisateur);
            notification.setRoleCible(role);
            notification.setTitre(titre);
            notification.setMessage(message);
            notification.setType(type);
            notification.setPriorite(priorite);
            notification.setGlobale(false);
            notification.setLue(false);
            notification.setDateCreation(LocalDateTime.now());
            notification.setDateExpiration(LocalDateTime.now().plusDays(30));

            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void envoyerNotificationGlobale(
            String titre,
            String message,
            TypeNotification type,
            PrioriteNotification priorite) {

        List<Utilisateur> tousUtilisateurs = utilisateurRepository.findAll();

        for (Utilisateur utilisateur : tousUtilisateurs) {
            Notification notification = new Notification();
            notification.setDestinataire(utilisateur);
            notification.setTitre(titre);
            notification.setMessage(message);
            notification.setType(type);
            notification.setPriorite(priorite);
            notification.setGlobale(true);
            notification.setLue(false);
            notification.setDateCreation(LocalDateTime.now());
            notification.setDateExpiration(LocalDateTime.now().plusDays(60));

            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void supprimerNotificationsExpirees() {
        List<Notification> expirees = notificationRepository
                .findNotificationsExpirees(LocalDateTime.now());

        notificationRepository.deleteAll(expirees);
        System.out.println("✅ " + expirees.size() + " notifications expirées supprimées");
    }
}