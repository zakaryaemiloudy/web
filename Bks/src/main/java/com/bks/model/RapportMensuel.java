package com.bks.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rapports_mensuels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RapportMensuel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id")
    private Hopital hopital;

    @Column(nullable = false)
    private Integer mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(name = "total_dons")
    private Integer totalDons = 0;

    @Column(name = "total_demandes")
    private Integer totalDemandes = 0;

    @Column(name = "total_satisfaites")
    private Integer totalSatisfaites = 0;

    @Column(name = "quantite_totale_collectee")
    private Integer quantiteTotaleCollectee = 0;

    @Column(name = "quantite_totale_distribuee")
    private Integer quantiteTotaleDistribuee = 0;

    @Column(name = "taux_satisfaction_moyen")
    private Double tauxSatisfactionMoyen = 0.0;

    @Column(name = "nombre_donneurs_actifs")
    private Integer nombreDonneursActifs = 0;

    @Column(name = "nombre_nouveaux_donneurs")
    private Integer nombreNouveauxDonneurs = 0;

    @Column(name = "groupe_plus_demande")
    private String groupePlusDemande;

    @Column(name = "recommandations", length = 2000)
    private String recommandations;

    @Column(name = "tendances", length = 2000)
    private String tendances;

    @Column(name = "date_generation")
    private LocalDateTime dateGeneration = LocalDateTime.now();

    @Column(name = "genere_par_id")
    private Long genereParId;
}