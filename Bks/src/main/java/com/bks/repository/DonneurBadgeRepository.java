package com.bks.repository;

import com.bks.model.DonneurBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonneurBadgeRepository extends JpaRepository<DonneurBadge, Long> {
    List<DonneurBadge> findByDonneurId(Long donneurId);
    List<DonneurBadge> findByBadgeId(Long badgeId);
    Optional<DonneurBadge> findByDonneurIdAndBadgeId(Long donneurId, Long badgeId);

    @Query("SELECT db FROM DonneurBadge db WHERE db.donneur.id = :donneurId AND db.affiche = true")
    List<DonneurBadge> findBadgesAffichesByDonneur(Long donneurId);
}