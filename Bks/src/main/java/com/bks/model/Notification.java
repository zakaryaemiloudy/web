package com.bks.model;

import com.bks.enums.PrioriteNotification;
import com.bks.enums.TypeNotification;
import com.bks.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrioriteNotification priorite = PrioriteNotification.NORMALE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinataire_id")
    private Utilisateur destinataire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id")
    private Hopital hopital;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_cible")
    private Role roleCible;

    @Column(nullable = false)
    private Boolean globale = false;

    @Column(nullable = false)
    private Boolean lue = false;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_lecture")
    private LocalDateTime dateLecture;

    @Column(name = "date_expiration")
    private LocalDateTime dateExpiration;

    @Column(name = "emetteur_id")
    private Long emetteurId;

    @Column(length = 500)
    private String lienAction;

    @Column(name = "donnees_supplementaires", length = 1000)
    private String donneesSupplementaires;
}