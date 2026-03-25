package com.bks.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

public class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    private static final List<DateTimeFormatter> FORMATTERS = Arrays.asList(
        DateTimeFormatter.ISO_LOCAL_DATE_TIME,
        DateTimeFormatter.ISO_LOCAL_DATE,
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"),
        DateTimeFormatter.ofPattern("dd/MM/yyyy")
    );

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        value = value.trim();

        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                if (formatter.toString().contains("HH") || value.contains(":")) {
                    return LocalDateTime.parse(value, formatter);
                } else {
                    return LocalDate.parse(value, formatter).atStartOfDay();
                }
            } catch (DateTimeParseException e) {
            }
        }

        throw new IOException("Unable to parse date: " + value);
    }
}
