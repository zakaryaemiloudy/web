package com.bks.dto;

import com.bks.enums.Role;
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private Role role;
    private Long hopitalId;
    private String hopitalNom;
    private Boolean actif;
    private Boolean isDonneurActif;
    private Boolean isPatientActif;
    private Integer pointsTotal;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String email, String nom, String prenom,
                        Role role, Long hopitalId, String hopitalNom, Boolean actif,
                        Boolean isDonneurActif, Boolean isPatientActif, Integer pointsTotal) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
        this.hopitalId = hopitalId;
        this.hopitalNom = hopitalNom;
        this.actif = actif;
        this.isDonneurActif = isDonneurActif;
        this.isPatientActif = isPatientActif;
        this.pointsTotal = pointsTotal;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getHopitalId() {
        return hopitalId;
    }

    public void setHopitalId(Long hopitalId) {
        this.hopitalId = hopitalId;
    }

    public String getHopitalNom() {
        return hopitalNom;
    }

    public void setHopitalNom(String hopitalNom) {
        this.hopitalNom = hopitalNom;
    }

    public Boolean getActif() {
        return actif;
    }

    public void setActif(Boolean actif) {
        this.actif = actif;
    }

    public Boolean getIsDonneurActif() {
        return isDonneurActif;
    }

    public void setIsDonneurActif(Boolean isDonneurActif) {
        this.isDonneurActif = isDonneurActif;
    }

    public Boolean getIsPatientActif() {
        return isPatientActif;
    }

    public void setIsPatientActif(Boolean isPatientActif) {
        this.isPatientActif = isPatientActif;
    }

    public Integer getPointsTotal() {
        return pointsTotal;
    }

    public void setPointsTotal(Integer pointsTotal) {
        this.pointsTotal = pointsTotal;
    }
}
