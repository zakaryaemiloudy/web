package com.bks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesGlobales {
    private Integer totalHopitaux;
    private Integer hopitauxActifs;
    private Integer hopitauxEnAttente;
    private Integer totalDonneurs;
    private Integer totalAdmins;
    private Integer totalUtilisateurs;
    private Long totalDons;
    private Long totalDemandes;
    private Integer campagnesActives;
    private Map<String, Integer> hopitauxParRegion;
    private Map<String, Long> donsParMois;
    private Map<String, Integer> donneursParVille;
    private Double tauxSatisfactionGlobal;
}