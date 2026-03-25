package com.bks.dto;

import com.bks.config.LocalDateTimeDeserializer;
import com.bks.enums.GroupeSanguin;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class CampagneRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    private Long hopitalId;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    @NotBlank(message = "La région est obligatoire")
    private String region;

    @NotNull(message = "La date de début est obligatoire")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime dateFin;

    @Min(value = 10, message = "Objectif minimum : 10 donneurs")
    private Integer objectifDonneurs;

    private GroupeSanguin groupeSanguinCible;
    private Boolean nationale = false;
    private String lieuCollecte;
    private String contactInfo;
    private String imageUrl;

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getHopitalId() {
        return hopitalId;
    }

    public void setHopitalId(Long hopitalId) {
        this.hopitalId = hopitalId;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public Integer getObjectifDonneurs() {
        return objectifDonneurs;
    }

    public void setObjectifDonneurs(Integer objectifDonneurs) {
        this.objectifDonneurs = objectifDonneurs;
    }

    public GroupeSanguin getGroupeSanguinCible() {
        return groupeSanguinCible;
    }

    public void setGroupeSanguinCible(GroupeSanguin groupeSanguinCible) {
        this.groupeSanguinCible = groupeSanguinCible;
    }

    public Boolean getNationale() {
        return nationale;
    }

    public void setNationale(Boolean nationale) {
        this.nationale = nationale;
    }

    public String getLieuCollecte() {
        return lieuCollecte;
    }

    public void setLieuCollecte(String lieuCollecte) {
        this.lieuCollecte = lieuCollecte;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}