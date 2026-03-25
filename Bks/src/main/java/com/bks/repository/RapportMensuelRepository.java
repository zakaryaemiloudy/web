package com.bks.repository;

import com.bks.model.RapportMensuel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RapportMensuelRepository extends JpaRepository<RapportMensuel, Long> {
    Optional<RapportMensuel> findByHopitalIdAndMoisAndAnnee(Long hopitalId, Integer mois, Integer annee);
    List<RapportMensuel> findByHopitalId(Long hopitalId);
    List<RapportMensuel> findByMoisAndAnnee(Integer mois, Integer annee);
    List<RapportMensuel> findByAnnee(Integer annee);
}