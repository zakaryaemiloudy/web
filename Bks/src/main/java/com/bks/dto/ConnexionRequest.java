package com.bks.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ConnexionRequest {
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;
}
