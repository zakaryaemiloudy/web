package com.bks.repository;

import com.bks.enums.StatutDemande;
import com.bks.enums.Urgence;
import com.bks.model.DemandeSang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DemandeSangRepository extends JpaRepository<DemandeSang, Long> {
    List<DemandeSang> findByPatientId(Long patientId);
    List<DemandeSang> findByHopitalId(Long hopitalId);
    List<DemandeSang> findByStatut(StatutDemande statut);
    List<DemandeSang> findByUrgence(Urgence urgence);
    List<DemandeSang> findByHopitalIdAndStatut(Long hopitalId, StatutDemande statut);
    List<DemandeSang> findByGroupeSanguinDemandeAndStatut(com.bks.enums.GroupeSanguin groupeSanguin, StatutDemande statut);

    @Query("SELECT d FROM DemandeSang d WHERE d.urgence = com.bks.enums.Urgence.CRITIQUE AND d.statut = com.bks.enums.StatutDemande.EN_ATTENTE")
    List<DemandeSang> findDemandesUrgentes();

    @Query("SELECT d FROM DemandeSang d WHERE d.dateDemande BETWEEN :debut AND :fin")
    List<DemandeSang> findByDateDemandeBetween(LocalDateTime debut, LocalDateTime fin);
}