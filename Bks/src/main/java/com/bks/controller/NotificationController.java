package com.bks.controller;

import com.bks.dto.NotificationResponse;
import com.bks.model.*;
import com.bks.repository.*;
import com.bks.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMesNotifications(Authentication auth) {
        var user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<Notification> notifications = notificationRepository
                .findByDestinataireIdOrderByDateCreationDesc(user.getId());

        return ResponseEntity.ok(
                notifications.stream()
                        .map(this::mapToResponse)
                        .toList()
        );
    }

    @GetMapping("/non-lues")
    public ResponseEntity<List<NotificationResponse>> getNotificationsNonLues(Authentication auth) {
        var user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<Notification> notifications = notificationRepository
                .findByDestinataireIdAndLueFalseOrderByDateCreationDesc(user.getId());

        return ResponseEntity.ok(
                notifications.stream()
                        .map(this::mapToResponse)
                        .toList()
        );
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCountNonLues(Authentication auth) {
        var user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(
                notificationRepository.countByDestinataireIdAndLueFalse(user.getId())
        );
    }

    @PutMapping("/{id}/lire")
    public ResponseEntity<NotificationResponse> marquerCommeLue(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));

        notification.setLue(true);
        notification.setDateLecture(LocalDateTime.now());
        notification = notificationRepository.save(notification);

        return ResponseEntity.ok(mapToResponse(notification));
    }

    @PutMapping("/tout-lire")
    public ResponseEntity<String> marquerToutCommeLu(Authentication auth) {
        var user = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<Notification> notifications = notificationRepository
                .findByDestinataireIdAndLueFalseOrderByDateCreationDesc(user.getId());

        notifications.forEach(n -> {
            n.setLue(true);
            n.setDateLecture(LocalDateTime.now());
        });

        notificationRepository.saveAll(notifications);

        return ResponseEntity.ok("Toutes les notifications sont marquées comme lues");
    }

    private NotificationResponse mapToResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setTitre(n.getTitre());
        r.setMessage(n.getMessage());
        r.setType(n.getType());
        r.setPriorite(n.getPriorite());
        r.setLue(n.getLue());
        r.setDateCreation(n.getDateCreation());
        r.setDateLecture(n.getDateLecture());
        r.setLienAction(n.getLienAction());
        return r;
    }
}