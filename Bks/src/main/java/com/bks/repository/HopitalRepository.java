package com.bks.repository;

import com.bks.enums.StatutHopital;
import com.bks.model.Hopital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HopitalRepository extends JpaRepository<Hopital, Long> {
    Optional<Hopital> findByNom(String nom);
    List<Hopital> findByStatut(StatutHopital statut);
    List<Hopital> findByVille(String ville);
    List<Hopital> findByRegion(String region);
    Boolean existsByNom(String nom);
    Boolean existsByEmail(String email);
    Boolean existsByTelephone(String telephone);
}