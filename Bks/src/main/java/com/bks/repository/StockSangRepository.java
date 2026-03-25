package com.bks.repository;

import com.bks.enums.GroupeSanguin;
import com.bks.enums.NiveauStock;
import com.bks.model.StockSang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockSangRepository extends JpaRepository<StockSang, Long> {
    Optional<StockSang> findByHopitalIdAndGroupeSanguin(Long hopitalId, GroupeSanguin groupeSanguin);
    Optional<StockSang> findByHopitalAndGroupeSanguin(com.bks.model.Hopital hopital, GroupeSanguin groupeSanguin);
    List<StockSang> findByHopitalId(Long hopitalId);
    List<StockSang> findByNiveauStock(NiveauStock niveauStock);

    @Query("SELECT s FROM StockSang s WHERE s.niveauStock IN (com.bks.enums.NiveauStock.CRITIQUE, com.bks.enums.NiveauStock.ALERTE)")
    List<StockSang> findStocksCritiquesOuAlerte();
}
