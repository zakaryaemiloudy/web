package com.bks.repository;

import com.bks.model.CandidatureDemande;
import com.bks.enums.StatutCandidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidatureDemandRepository extends JpaRepository<CandidatureDemande, Long> {
    
    List<CandidatureDemande> findByDemandeId(Long demandeId);
    
    List<CandidatureDemande> findByDonneurId(Long donneurId);
    
    Optional<CandidatureDemande> findByDemandeIdAndDonneurId(Long demandeId, Long donneurId);
    
    List<CandidatureDemande> findByDemandeIdAndStatut(Long demandeId, StatutCandidature statut);
    
    List<CandidatureDemande> findByDonneurIdAndStatut(Long donneurId, StatutCandidature statut);
}
