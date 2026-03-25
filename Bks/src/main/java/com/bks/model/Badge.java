package com.bks.model;

import com.bks.enums.NiveauBadge;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(nullable = false, length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NiveauBadge niveau;

    @Column(name = "icone_url")
    private String iconeUrl;

    @Column(name = "condition_obtention")
    private String conditionObtention;

    @Column(name = "nombre_dons_requis")
    private Integer nombreDonsRequis;

    @Column(nullable = false)
    private Boolean actif = true;

    @Column(name = "points_attribues")
    private Integer pointsAttribues;
}