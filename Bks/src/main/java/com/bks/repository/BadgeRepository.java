package com.bks.repository;

import com.bks.enums.NiveauBadge;
import com.bks.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByNom(String nom);
    List<Badge> findByNiveau(NiveauBadge niveau);
    List<Badge> findByActifTrue();
    List<Badge> findByNombreDonsRequisLessThanEqual(Integer nombreDons);
}
