package com.bks.model;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.StatutDemande;
import com.bks.enums.Urgence;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "demandes_sang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeSang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Utilisateur patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id", nullable = false)
    private Hopital hopital;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin_demande", nullable = false)
    private GroupeSanguin groupeSanguinDemande;

    @Column(name = "quantite_demandee", nullable = false)
    private Integer quantiteDemandee;

    @Column(name = "date_demande", nullable = false)
    private LocalDateTime dateDemande = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgence urgence = Urgence.NORMALE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDemande statut = StatutDemande.EN_ATTENTE;

    @Column(name = "nom_patient", nullable = false)
    private String nomPatient;

    @Column(name = "prenom_patient", nullable = false)
    private String prenomPatient;

    @Column(nullable = false)
    private String diagnostic;

    @Column(name = "medecin_prescripteur")
    private String medecinPrescripteur;

    @Column(name = "date_besoin")
    private LocalDateTime dateBesoin;

    @Column(name = "traitee_par_id")
    private Long traiteeParId;

    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;

    @Column(length = 500)
    private String notes;

    @Column(name = "numero_transfusion")
    private String numeroTransfusion;
}