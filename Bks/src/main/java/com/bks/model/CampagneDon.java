package com.bks.model;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.StatutCampagne;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "campagnes_don")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampagneDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id")
    private Hopital hopital;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String region;

    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDateTime dateFin;

    @Column(name = "objectif_donneurs")
    private Integer objectifDonneurs;

    @Column(name = "nombre_participants")
    private Integer nombreParticipants = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin_cible")
    private GroupeSanguin groupeSanguinCible;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCampagne statut = StatutCampagne.PLANIFIEE;

    @Column(nullable = false)
    private Boolean nationale = false;

    @Column(name = "creee_par_id", nullable = false)
    private Long creeeParId;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "lieu_collecte")
    private String lieuCollecte;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "nombre_dons_collectes")
    private Integer nombreDonsCollectes = 0;

    @Column(name = "quantite_collectee")
    private Integer quantiteCollectee = 0;

    public Double getProgressionPourcentage() {
        if (objectifDonneurs == null || objectifDonneurs == 0) {
            return 0.0;
        }
        return (nombreParticipants * 100.0) / objectifDonneurs;
    }
}