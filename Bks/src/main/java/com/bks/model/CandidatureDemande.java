package com.bks.model;

import com.bks.enums.StatutCandidature;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidature_demandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidatureDemande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "demande_id", nullable = false)
    private DemandeSang demande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donneur_id", nullable = false)
    private Donneur donneur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCandidature statut;

    @Column(nullable = false)
    private LocalDateTime dateCandidature;

    private LocalDateTime dateTraitement;

    @Column(length = 500)
    private String notes;

    private Boolean peutDonner;

    @PrePersist
    protected void onCreate() {
        dateCandidature = LocalDateTime.now();
        if (statut == null) {
            statut = StatutCandidature.EN_ATTENTE;
        }
    }
}
