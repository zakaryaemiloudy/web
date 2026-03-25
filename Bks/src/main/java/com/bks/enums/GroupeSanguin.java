package com.bks.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GroupeSanguin {
    A_POSITIF("A+"),
    A_NEGATIF("A-"),
    B_POSITIF("B+"),
    B_NEGATIF("B-"),
    AB_POSITIF("AB+"),
    AB_NEGATIF("AB-"),
    O_POSITIF("O+"),
    O_NEGATIF("O-");

    private final String code;

    GroupeSanguin(String code) {
        this.code = code;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static GroupeSanguin fromCode(String code) {
        if (code == null) {
            return null;
        }
        for (GroupeSanguin value : values()) {
            if (value.code.equalsIgnoreCase(code) || value.name().equalsIgnoreCase(code)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid blood group: " + code);
    }
}
