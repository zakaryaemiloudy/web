package com.bks.dto;

import com.bks.enums.StatutCandidature;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatureDemandResponse {
    
    private Long id;
    private Long demandeId;
    private Long donneurId;
    private String donneurNom;
    private String donneurPrenom;
    private String donneurEmail;
    private String donneurGroupeSanguin;
    private String groupeSanguinDemande;
    private StatutCandidature statut;
    private LocalDateTime dateCandidature;
    private LocalDateTime dateTraitement;
    private String notes;
    private Boolean peutDonner;
}
