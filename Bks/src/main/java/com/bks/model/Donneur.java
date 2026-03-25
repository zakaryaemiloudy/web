package com.bks.model;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.Sexe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donneurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donneur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(nullable = false, unique = true)
    private String cin;

    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin", nullable = false)
    private GroupeSanguin groupeSanguin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sexe sexe;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    @Column(name = "eligible")
    private Boolean eligible = true;

    @Column(name = "date_dernier_don")
    private LocalDate dateDernierDon;

    @Column(name = "nombre_dons_total")
    private Integer nombreDonsTotal = 0;

    @Column(name = "date_prochaine_eligibilite")
    private LocalDate dateProchaineEligibilite;

    @Column(length = 500)
    private String notes;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription = LocalDateTime.now();

    @Column(nullable = false)
    private Double poids;

    @Column(name = "antecedents_medicaux", length = 1000)
    private String antecedentsMedicaux;
}