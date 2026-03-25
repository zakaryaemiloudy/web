package com.bks.repository;

import com.bks.enums.GroupeSanguin;
import com.bks.model.Donneur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonneurRepository extends JpaRepository<Donneur, Long> {
    Optional<Donneur> findByUtilisateurId(Long utilisateurId);
    Optional<Donneur> findByUtilisateur(com.bks.model.Utilisateur utilisateur);
    Optional<Donneur> findByCin(String cin);
    Boolean existsByCin(String cin);
    List<Donneur> findByGroupeSanguin(GroupeSanguin groupeSanguin);
    List<Donneur> findByEligibleTrue();
    List<Donneur> findByVille(String ville);

    @Query("SELECT d FROM Donneur d WHERE d.dateProchaineEligibilite <= :date AND d.eligible = true")
    List<Donneur> findDonneursEligiblesAvant(LocalDate date);

    @Query("SELECT d FROM Donneur d ORDER BY d.nombreDonsTotal DESC")
    List<Donneur> findTopDonneurs();
}
