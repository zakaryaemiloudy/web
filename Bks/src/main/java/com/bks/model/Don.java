package com.bks.model;

import com.bks.enums.StatutDon;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "dons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Don {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donneur_id", nullable = false)
    private Donneur donneur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id", nullable = false)
    private Hopital hopital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campagne_id")
    private CampagneDon campagne;

    @Column(name = "date_don", nullable = false)
    private LocalDateTime dateDon = LocalDateTime.now();

    @Column(name = "quantite_ml", nullable = false)
    private Integer quantiteMl = 450;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDon statut = StatutDon.EN_ATTENTE;

    @Column(name = "numero_poche", unique = true)
    private String numeroPoche;

    @Column(name = "date_peremption")
    private LocalDateTime datePeremption;

    @Column(name = "valide_par_id")
    private Long valideParId;

    @Column(name = "date_validation")
    private LocalDateTime dateValidation;

    @Column(length = 500)
    private String notes;

    @Column(name = "tests_effectues")
    private Boolean testsEffectues = false;

    @Column(name = "resultats_tests")
    private String resultatsTests;

    @Column(name = "points_attribues")
    private Integer pointsAttribues = 10;
}