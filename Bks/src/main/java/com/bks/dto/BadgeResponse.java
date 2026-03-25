package com.bks.dto;

import com.bks.enums.NiveauBadge;
import java.time.LocalDateTime;

public class BadgeResponse {
    private Long id;
    private String nom;
    private String description;
    private NiveauBadge niveau;
    private String iconeUrl;
    private Integer nombreDonsRequis;
    private Integer pointsAttribues;
    private LocalDateTime dateObtention;
    private Boolean obtenu = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public NiveauBadge getNiveau() {
        return niveau;
    }

    public void setNiveau(NiveauBadge niveau) {
        this.niveau = niveau;
    }

    public String getIconeUrl() {
        return iconeUrl;
    }

    public void setIconeUrl(String iconeUrl) {
        this.iconeUrl = iconeUrl;
    }

    public Integer getNombreDonsRequis() {
        return nombreDonsRequis;
    }

    public void setNombreDonsRequis(Integer nombreDonsRequis) {
        this.nombreDonsRequis = nombreDonsRequis;
    }

    public Integer getPointsAttribues() {
        return pointsAttribues;
    }

    public void setPointsAttribues(Integer pointsAttribues) {
        this.pointsAttribues = pointsAttribues;
    }

    public LocalDateTime getDateObtention() {
        return dateObtention;
    }

    public void setDateObtention(LocalDateTime dateObtention) {
        this.dateObtention = dateObtention;
    }

    public Boolean getObtenu() {
        return obtenu;
    }

    public void setObtenu(Boolean obtenu) {
        this.obtenu = obtenu;
    }
}