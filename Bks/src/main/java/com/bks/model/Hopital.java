package com.bks.model;

import com.bks.enums.StatutHopital;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "hopitaux")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hopital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false, unique = true)
    private String telephone;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutHopital statut = StatutHopital.EN_ATTENTE;

    @Column(name = "capacite_stockage")
    private Integer capaciteStockage = 1000;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(name = "valide_par_id")
    private Long valideParId;

    @Column(name = "certifie")
    private Boolean certifie = false;

    @Column(name = "score_performance")
    private Double scorePerformance = 0.0;

    @Column(length = 500)
    private String description;
}