package com.bks.model;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.NiveauStock;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_sang",
        uniqueConstraints = @UniqueConstraint(columnNames = {"hopital_id", "groupe_sanguin"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockSang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id", nullable = false)
    private Hopital hopital;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin", nullable = false)
    private GroupeSanguin groupeSanguin;

    @Column(name = "quantite_disponible", nullable = false)
    private Integer quantiteDisponible = 0;

    @Column(name = "nombre_poches", nullable = false)
    private Integer nombrePoches = 0;

    @Column(name = "seuil_alerte")
    private Integer seuilAlerte = 5000;

    @Column(name = "seuil_critique")
    private Integer seuilCritique = 2000;

    @Column(name = "derniere_mise_a_jour")
    private LocalDateTime derniereMiseAJour = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "niveau_stock")
    private NiveauStock niveauStock = NiveauStock.NORMAL;

    @Column(name = "quantite_reservee")
    private Integer quantiteReservee = 0;

    @Column(name = "quantite_perimee_mois")
    private Integer quantitePerimeeMois = 0;

    public void calculerNiveauStock() {
        if (quantiteDisponible <= seuilCritique) {
            this.niveauStock = NiveauStock.CRITIQUE;
        } else if (quantiteDisponible <= seuilAlerte) {
            this.niveauStock = NiveauStock.ALERTE;
        } else if (quantiteDisponible <= seuilAlerte * 2) {
            this.niveauStock = NiveauStock.NORMAL;
        } else {
            this.niveauStock = NiveauStock.OPTIMAL;
        }
    }
}