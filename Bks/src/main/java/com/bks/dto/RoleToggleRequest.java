package com.bks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleToggleRequest {
    private Boolean isDonneurActif;
    private Boolean isPatientActif;
}
