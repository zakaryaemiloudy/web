package com.bks.model;

import com.bks.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String telephone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id")
    private Hopital hopital;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "derniere_connexion")
    private LocalDateTime derniereConnexion;

    // Role management for donor/patient toggle
    @Column(name = "is_donneur_actif")
    private Boolean isDonneurActif = true;

    @Column(name = "is_patient_actif")
    private Boolean isPatientActif = false;

    @Column(name = "points_total")
    private Integer pointsTotal = 0;

    @Column(name = "groupe_sanguin")
    private String groupeSanguin;
}