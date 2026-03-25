package com.bks.dto;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.NiveauStock;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockResponse {
    private Long id;
    private Long hopitalId;
    private String hopitalNom;
    private GroupeSanguin groupeSanguin;
    private Integer quantiteDisponible;
    private Integer nombrePoches;
    private Integer seuilAlerte;
    private Integer seuilCritique;
    private LocalDateTime derniereMiseAJour;
    private NiveauStock niveauStock;
    private Integer quantiteReservee;
    private Double pourcentageDisponible;

    public void calculerPourcentage() {
        if (seuilAlerte != null && seuilAlerte > 0) {
            this.pourcentageDisponible = (quantiteDisponible * 100.0) / (seuilAlerte * 2);
        }
    }
}