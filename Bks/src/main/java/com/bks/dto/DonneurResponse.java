package com.bks.dto;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.Sexe;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DonneurResponse {
    private Long id;
    private Long utilisateurId;
    private String nom;
    private String prenom;
    private String email;
    private String cin;
    private LocalDate dateNaissance;
    private GroupeSanguin groupeSanguin;
    private Sexe sexe;
    private String adresse;
    private String ville;
    private String telephone;
    private Boolean eligible;
    private LocalDate dateDernierDon;
    private Integer nombreDonsTotal;
    private LocalDate dateProchaineEligibilite;
    private Integer pointsTotal;
    private List<BadgeResponse> badges;
}