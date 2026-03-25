package com.bks.controller;

import com.bks.dto.HopitalResponse;
import com.bks.enums.StatutHopital;
import com.bks.repository.HopitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private HopitalRepository hopitalRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Blood Bank System API is running");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "API accessible sans authentification");
        response.put("info", "Si vous voyez ce message, l'API fonctionne correctement");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hopitaux")
    public ResponseEntity<List<HopitalResponse>> getHopitauxValides() {
        List<HopitalResponse> hopitaux = hopitalRepository.findByStatut(StatutHopital.VALIDE)
                .stream()
                .map(h -> {
                    HopitalResponse r = new HopitalResponse();
                    r.setId(h.getId());
                    r.setNom(h.getNom());
                    r.setVille(h.getVille());
                    r.setRegion(h.getRegion());
                    r.setStatut(h.getStatut());
                    return r;
                })
                .toList();
        return ResponseEntity.ok(hopitaux);
    }
}
