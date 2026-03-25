package com.bks.dto;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.Sexe;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.bks.config.LocalDateDeserializer;
import java.time.LocalDate;

public class DonneurUpdateRequest {
    // User fields
    private String nom;
    private String prenom;
    private String telephone;

    // Donor fields
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dateNaissance;
    private GroupeSanguin groupeSanguin;
    private Sexe sexe;
    private String adresse;
    private String ville;

    // Getters and Setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public GroupeSanguin getGroupeSanguin() {
        return groupeSanguin;
    }

    public void setGroupeSanguin(GroupeSanguin groupeSanguin) {
        this.groupeSanguin = groupeSanguin;
    }

    public Sexe getSexe() {
        return sexe;
    }

    public void setSexe(Sexe sexe) {
        this.sexe = sexe;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }
}
