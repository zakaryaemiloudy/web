package com.bks.dto;

import com.bks.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class InscriptionRequest {
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{10}$", message = "Le téléphone doit contenir 10 chiffres")
    private String telephone;

    @NotNull(message = "Le rôle est obligatoire")
    private Role role;

    private Long hopitalId;
}
