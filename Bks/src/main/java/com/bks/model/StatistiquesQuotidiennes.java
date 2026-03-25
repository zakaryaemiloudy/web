package com.bks.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "statistiques_quotidiennes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"hopital_id", "date"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesQuotidiennes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id")
    private Hopital hopital;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "nombre_dons")
    private Integer nombreDons = 0;

    @Column(name = "nombre_demandes")
    private Integer nombreDemandes = 0;

    @Column(name = "demandes_satisfaites")
    private Integer demandesSatisfaites = 0;

    @Column(name = "quantite_collectee")
    private Integer quantiteCollectee = 0;

    @Column(name = "quantite_distribuee")
    private Integer quantiteDistribuee = 0;

    @Column(name = "nouveaux_donneurs")
    private Integer nouveauxDonneurs = 0;

    @Column(name = "stocks_critiques")
    private Integer stocksCritiques = 0;

    @Column(name = "alertes_envoyees")
    private Integer alertesEnvoyees = 0;

    @Column(name = "taux_satisfaction")
    private Double tauxSatisfaction = 0.0;
}
