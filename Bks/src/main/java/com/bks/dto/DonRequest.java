package com.bks.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class DonRequest {
    private Long hopitalId;

    private Long campagneId;

    @Min(value = 350, message = "Quantité minimale : 350 ml")
    @Max(value = 500, message = "Quantité maximale : 500 ml")
    private Integer quantiteMl = 450;

    private LocalDateTime dateDon;

    private String notes;
}
