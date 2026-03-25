package com.bks.dto;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.StatutDemande;
import com.bks.enums.Urgence;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DemandeSangResponse {
    private Long id;
    private Long patientId;
    private String patientEmail;
    private Long hopitalId;
    private String hopitalNom;
    private GroupeSanguin groupeSanguinDemande;
    private Integer quantiteDemandee;
    private LocalDateTime dateDemande;
    private Urgence urgence;
    private StatutDemande statut;
    private String nomPatient;
    private String prenomPatient;
    private String diagnostic;
    private String medecinPrescripteur;
    private LocalDateTime dateBesoin;
    private String notes;
    private LocalDateTime dateTraitement;
}
