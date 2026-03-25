package com.bks.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class HopitalRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    @NotBlank(message = "La région est obligatoire")
    private String region;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{10}$", message = "Le téléphone doit contenir 10 chiffres")
    private String telephone;

    @Email(message = "Format d'email invalide")
    private String email;

    @Min(value = 100, message = "Capacité minimale : 100")
    private Integer capaciteStockage = 1000;

    private String description;
}