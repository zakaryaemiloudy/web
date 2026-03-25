package com.bks.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "donneurs_badges",
        uniqueConstraints = @UniqueConstraint(columnNames = {"donneur_id", "badge_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonneurBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donneur_id", nullable = false)
    private Donneur donneur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    @Column(name = "date_obtention", nullable = false)
    private LocalDateTime dateObtention = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean affiche = true;
}
