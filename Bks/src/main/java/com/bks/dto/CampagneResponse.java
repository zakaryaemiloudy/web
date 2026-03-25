package com.bks.dto;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.StatutCampagne;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CampagneResponse {
    private Long id;
    private String titre;
    private String description;
    private Long hopitalId;
    private String hopitalNom;
    private String ville;
    private String region;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Integer objectifDonneurs;
    private Integer nombreParticipants;
    private GroupeSanguin groupeSanguinCible;
    private StatutCampagne statut;
    private Boolean nationale;
    private LocalDateTime dateCreation;
    private String lieuCollecte;
    private String contactInfo;
    private String imageUrl;
    private Integer nombreDonsCollectes;
    private Integer quantiteCollectee;
    private Double progressionPourcentage;
}
