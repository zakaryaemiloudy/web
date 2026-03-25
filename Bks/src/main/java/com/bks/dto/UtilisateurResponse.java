package com.bks.dto;

import com.bks.enums.Role;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UtilisateurResponse {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private Role role;
    private Long hopitalId;
    private String hopitalNom;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime derniereConnexion;
    private Integer pointsTotal;
}