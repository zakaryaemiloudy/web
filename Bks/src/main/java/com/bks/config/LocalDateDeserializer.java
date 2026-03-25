package com.bks.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

public class LocalDateDeserializer extends JsonDeserializer<LocalDate> {

    private static final List<DateTimeFormatter> FORMATTERS = Arrays.asList(
        DateTimeFormatter.ISO_LOCAL_DATE,
        DateTimeFormatter.ofPattern("dd/MM/yyyy"),
        DateTimeFormatter.ofPattern("MM/dd/yyyy"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd")
    );

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        value = value.trim();

        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalDate.parse(value, formatter);
            } catch (DateTimeParseException e) {
                // Try next format
            }
        }

        throw new IOException("Unable to parse date: " + value);
    }
}
