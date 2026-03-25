package com.bks.dto;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.StatutDon;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DonResponse {
    private Long id;
    private Long donneurId;
    private String donneurNom;
    private String donneurPrenom;
    private GroupeSanguin groupeSanguin;
    private Long hopitalId;
    private String hopitalNom;
    private Long campagneId;
    private String campagneTitre;
    private LocalDateTime dateDon;
    private Integer quantiteMl;
    private StatutDon statut;
    private String numeroPoche;
    private LocalDateTime datePeremption;
    private String notes;
    private Boolean testsEffectues;
    private Integer pointsAttribues;
}
