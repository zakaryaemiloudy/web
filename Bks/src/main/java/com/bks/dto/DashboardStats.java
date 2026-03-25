package com.bks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Integer totalDonneurs;
    private Integer totalDons;
    private Integer totalDemandes;
    private Integer demandesPendantes;
    private Integer stocksCritiques;
    private Integer nouveauxDonneursAujourdHui;
    private Integer donsAujourdHui;
    private Integer demandesAujourdHui;
    private Double tauxSatisfaction;
}