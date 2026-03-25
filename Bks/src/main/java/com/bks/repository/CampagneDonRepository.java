package com.bks.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bks.enums.StatutCampagne;
import com.bks.model.CampagneDon;

@Repository
public interface CampagneDonRepository extends JpaRepository<CampagneDon, Long> {
    List<CampagneDon> findByStatut(StatutCampagne statut);
    List<CampagneDon> findByHopitalId(Long hopitalId);
    List<CampagneDon> findByNationaleTrueOrderByDateDebutDesc();
    List<CampagneDon> findByVilleOrRegion(String ville, String region);

    // Get campaigns where either dateDebut has passed OR it's planned for future, and dateFin is in future
    @Query("SELECT c FROM CampagneDon c WHERE c.dateFin >= :now AND (c.statut = com.bks.enums.StatutCampagne.EN_COURS OR c.statut = com.bks.enums.StatutCampagne.PLANIFIEE) ORDER BY c.dateDebut ASC")
    List<CampagneDon> findCampagnesActives(LocalDateTime now);
}
