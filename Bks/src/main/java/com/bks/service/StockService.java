package com.bks.service;

import com.bks.dto.StockResponse;
import com.bks.enums.GroupeSanguin;
import com.bks.enums.NiveauStock;
import com.bks.enums.PrioriteNotification;
import com.bks.enums.TypeNotification;
import com.bks.model.*;
import com.bks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private StockSangRepository stockRepository;

    @Autowired
    private HopitalRepository hopitalRepository;

    @Autowired
    private NotificationService notificationService;

    public List<StockResponse> getStockParHopital(Long hopitalId) {
        return stockRepository.findByHopitalId(hopitalId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StockResponse getStockParGroupeSanguin(Long hopitalId, GroupeSanguin groupe) {
        StockSang stock = stockRepository.findByHopitalIdAndGroupeSanguin(hopitalId, groupe)
                .orElseGet(() -> {
                    Hopital hopital = hopitalRepository.findById(hopitalId)
                            .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));
                    StockSang newStock = new StockSang();
                    newStock.setHopital(hopital);
                    newStock.setGroupeSanguin(groupe);
                    newStock.setQuantiteDisponible(0);
                    newStock.setNombrePoches(0);
                    newStock.calculerNiveauStock();
                    return stockRepository.save(newStock);
                });
        return mapToResponse(stock);
    }

    @Transactional
    public void ajouterStock(Long hopitalId, GroupeSanguin groupe, Integer quantite) {
        StockSang stock = stockRepository.findByHopitalIdAndGroupeSanguin(hopitalId, groupe)
                .orElseGet(() -> {
                    Hopital hopital = hopitalRepository.findById(hopitalId)
                            .orElseThrow(() -> new RuntimeException("Hôpital non trouvé"));
                    StockSang newStock = new StockSang();
                    newStock.setHopital(hopital);
                    newStock.setGroupeSanguin(groupe);
                    newStock.setQuantiteDisponible(0);
                    newStock.setNombrePoches(0);
                    return newStock;
                });

        stock.setQuantiteDisponible(stock.getQuantiteDisponible() + quantite);
        stock.setNombrePoches(stock.getNombrePoches() + 1);
        stock.setDerniereMiseAJour(LocalDateTime.now());
        stock.calculerNiveauStock();

        stockRepository.save(stock);
    }

    @Transactional
    public void deduireStock(Long hopitalId, GroupeSanguin groupe, Integer quantite) {
        StockSang stock = stockRepository.findByHopitalIdAndGroupeSanguin(hopitalId, groupe)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));

        if (stock.getQuantiteDisponible() < quantite) {
            throw new RuntimeException("Stock insuffisant");
        }

        stock.setQuantiteDisponible(stock.getQuantiteDisponible() - quantite);
        if (quantite >= 450) {
            stock.setNombrePoches(Math.max(0, stock.getNombrePoches() - 1));
        }
        stock.setDerniereMiseAJour(LocalDateTime.now());
        stock.calculerNiveauStock();

        stockRepository.save(stock);

        if (stock.getNiveauStock() == NiveauStock.CRITIQUE) {
            notificationService.envoyerNotificationHopital(
                    hopitalId,
                    "⚠️ Stock Critique!",
                    "Le stock de " + groupe + " est critique (" + stock.getQuantiteDisponible() + " ml)",
                    TypeNotification.URGENCE,
                    PrioriteNotification.CRITIQUE
            );
        }
    }

    public List<StockResponse> getStocksCritiques() {
        return stockRepository.findStocksCritiquesOuAlerte().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StockResponse updateStockQuantity(Long stockId, Integer nouvelleQuantite, Long hopitalId) {
        StockSang stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
        
        // Verify the stock belongs to the admin's hospital
        if (!stock.getHopital().getId().equals(hopitalId)) {
            throw new RuntimeException("Vous n'avez pas accès à ce stock");
        }
        
        stock.setQuantiteDisponible(nouvelleQuantite);
        stock.setNombrePoches(nouvelleQuantite / 450); // Assuming 450ml per bag
        stock.setDerniereMiseAJour(LocalDateTime.now());
        stock.calculerNiveauStock();
        
        stock = stockRepository.save(stock);
        
        // Send notification if stock becomes critical
        if (stock.getNiveauStock() == NiveauStock.CRITIQUE) {
            notificationService.envoyerNotificationHopital(
                    hopitalId,
                    "⚠️ Stock Critique!",
                    "Le stock de " + stock.getGroupeSanguin() + " est critique (" + stock.getQuantiteDisponible() + " ml)",
                    TypeNotification.URGENCE,
                    PrioriteNotification.CRITIQUE
            );
        }
        
        return mapToResponse(stock);
    }

    @Transactional
    public StockResponse updateStockSeuils(Long stockId, Integer seuilAlerte, Integer seuilCritique, Long hopitalId) {
        StockSang stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
        
        // Verify the stock belongs to the admin's hospital
        if (!stock.getHopital().getId().equals(hopitalId)) {
            throw new RuntimeException("Vous n'avez pas accès à ce stock");
        }
        
        // Validate thresholds
        if (seuilCritique >= seuilAlerte) {
            throw new RuntimeException("Le seuil critique doit être inférieur au seuil d'alerte");
        }
        if (seuilAlerte <= 0 || seuilCritique <= 0) {
            throw new RuntimeException("Les seuils doivent être positifs");
        }
        
        stock.setSeuilAlerte(seuilAlerte);
        stock.setSeuilCritique(seuilCritique);
        stock.setDerniereMiseAJour(LocalDateTime.now());
        stock.calculerNiveauStock();
        
        stock = stockRepository.save(stock);
        
        return mapToResponse(stock);
    }

    private StockResponse mapToResponse(StockSang stock) {
        StockResponse response = new StockResponse();
        response.setId(stock.getId());
        response.setHopitalId(stock.getHopital().getId());
        response.setHopitalNom(stock.getHopital().getNom());
        response.setGroupeSanguin(stock.getGroupeSanguin());
        response.setQuantiteDisponible(stock.getQuantiteDisponible());
        response.setNombrePoches(stock.getNombrePoches());
        response.setSeuilAlerte(stock.getSeuilAlerte());
        response.setSeuilCritique(stock.getSeuilCritique());
        response.setDerniereMiseAJour(stock.getDerniereMiseAJour());
        response.setNiveauStock(stock.getNiveauStock());
        response.setQuantiteReservee(stock.getQuantiteReservee());
        response.calculerPourcentage();
        return response;
    }
}