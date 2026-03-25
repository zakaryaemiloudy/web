package com.bks.repository;

import com.bks.enums.StatutDon;
import com.bks.model.Don;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonRepository extends JpaRepository<Don, Long> {
    List<Don> findByDonneurId(Long donneurId);
    List<Don> findByHopitalId(Long hopitalId);
    List<Don> findByStatut(StatutDon statut);
    List<Don> findByHopitalIdAndStatut(Long hopitalId, StatutDon statut);

    @Query("SELECT d FROM Don d WHERE d.datePeremption < :date AND d.statut = com.bks.enums.StatutDon.VALIDE")
    List<Don> findDonsPerimes(LocalDateTime date);

    @Query("SELECT d FROM Don d WHERE d.hopital.id = :hopitalId AND d.dateDon BETWEEN :debut AND :fin")
    List<Don> findByHopitalAndDateBetween(Long hopitalId, LocalDateTime debut, LocalDateTime fin);

    @Query("SELECT COUNT(d) FROM Don d WHERE d.donneur.id = :donneurId AND d.statut = com.bks.enums.StatutDon.VALIDE")
    Long countDonsValidesByDonneur(Long donneurId);
}