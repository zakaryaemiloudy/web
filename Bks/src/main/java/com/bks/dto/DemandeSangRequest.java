package com.bks.dto;

import com.bks.config.LocalDateTimeDeserializer;
import com.bks.enums.GroupeSanguin;
import com.bks.enums.Urgence;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DemandeSangRequest {
    @NotNull(message = "Le groupe sanguin est obligatoire")
    private GroupeSanguin groupeSanguinDemande;

    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 100, message = "Quantité minimale : 100 ml")
    private Integer quantiteDemandee;

    @NotNull(message = "L'hôpital est obligatoire")
    private Long hopitalId;

    @NotNull(message = "L'urgence est obligatoire")
    private Urgence urgence;

    @NotBlank(message = "Le nom du patient est obligatoire")
    private String nomPatient;

    @NotBlank(message = "Le prénom du patient est obligatoire")
    private String prenomPatient;

    @NotBlank(message = "Le diagnostic est obligatoire")
    private String diagnostic;

    private String medecinPrescripteur;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime dateBesoin;
    private String notes;
}
