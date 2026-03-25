package com.bks.dto;

import com.bks.enums.StatutHopital;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HopitalResponse {
    private Long id;
    private String nom;
    private String adresse;
    private String ville;
    private String region;
    private String telephone;
    private String email;
    private StatutHopital statut;
    private Integer capaciteStockage;
    private Integer stockActuel;
    private LocalDateTime dateCreation;
    private LocalDateTime dateValidation;
    private Boolean certifie;
    private Double scorePerformance;
    private String description;
}