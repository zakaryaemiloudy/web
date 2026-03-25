package com.bks.dto;

import java.time.LocalDateTime;

import com.bks.enums.PrioriteNotification;
import com.bks.enums.TypeNotification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "Le message est obligatoire")
    private String message;

    @NotNull(message = "Le type est obligatoire")
    private TypeNotification type;

    @NotNull(message = "La priorité est obligatoire")
    private PrioriteNotification priorite;

    private Long destinataireId;
    private Long hopitalId;
    private String roleCible;  // Changed from Role to String to handle empty values
    private Boolean globale = false;
    private LocalDateTime dateExpiration;
    private String lienAction;
}