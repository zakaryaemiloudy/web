package com.bks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalytics {
    private DashboardStats stats;
    private Map<String, Integer> donsParGroupe;
    private Map<String, Integer> demandesParGroupe;
    private List<StockResponse> stocksCritiques;
    private List<DemandeSangResponse> demandesUrgentes;
    private List<DonneurResponse> topDonneurs;
    private Map<String, Integer> evolutionDons;
    private Map<String, Double> performanceHopitaux;
}
