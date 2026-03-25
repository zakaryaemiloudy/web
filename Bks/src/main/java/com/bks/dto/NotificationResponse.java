package com.bks.dto;

import com.bks.enums.PrioriteNotification;
import com.bks.enums.TypeNotification;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String titre;
    private String message;
    private TypeNotification type;
    private PrioriteNotification priorite;
    private Boolean lue;
    private LocalDateTime dateCreation;
    private LocalDateTime dateLecture;
    private String lienAction;
}