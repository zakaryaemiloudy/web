package com.bks.repository;

import com.bks.model.StatistiquesQuotidiennes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StatistiquesQuotidiennesRepository extends JpaRepository<StatistiquesQuotidiennes, Long> {
    Optional<StatistiquesQuotidiennes> findByHopitalIdAndDate(Long hopitalId, LocalDate date);
    List<StatistiquesQuotidiennes> findByHopitalId(Long hopitalId);
    List<StatistiquesQuotidiennes> findByDate(LocalDate date);
    List<StatistiquesQuotidiennes> findByDateBetween(LocalDate debut, LocalDate fin);
}