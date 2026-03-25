package com.bks.controller;

import com.bks.dto.ChatMessageRequest;
import com.bks.dto.ChatMessageResponse;
import com.bks.model.Utilisateur;
import com.bks.repository.UtilisateurRepository;
import com.bks.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PostMapping("/message")
    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestBody ChatMessageRequest request) {
        Long utilisateurId = getCurrentUserId();
        ChatMessageResponse response = chatbotService.processMessage(request, utilisateurId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSuggestions() {
        Map<String, Object> response = new HashMap<>();
        response.put("suggestions", chatbotService.getSuggestions());
        response.put("quickActions", chatbotService.getQuickActions());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/historique")
    public ResponseEntity<Map<String, Object>> getHistorique(@RequestParam(required = false) String sessionId) {
        Map<String, Object> response = new HashMap<>();
        response.put("messages", chatbotService.getConversationHistory(sessionId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/historique")
    public ResponseEntity<Map<String, String>> clearHistorique(@RequestParam(required = false) String sessionId) {
        chatbotService.clearHistory(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Historique effacé avec succès");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "OK");
        status.put("service", "Chatbot BKS");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return utilisateurRepository.findByEmail(email)
                    .map(Utilisateur::getId)
                    .orElse(null);
        }
        return null;
    }
}
