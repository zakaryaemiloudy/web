package com.bks.chatbot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Value("${chatbot.ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${chatbot.ai.api-key:}")
    private String apiKey;

    @Value("${chatbot.ai.api-url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${chatbot.ai.model:llama-3.3-70b-versatile}")
    private String model;

    private final RestTemplate restTemplate;

    private static final String SYSTEM_PROMPT = """
            Tu es l'assistant virtuel du système de banque de sang BKS (Blood Bank System).
            Tu aides les utilisateurs marocains avec:
            - Questions sur le don de sang (éligibilité, processus, effets)
            - Informations sur les groupes sanguins et compatibilité
            - Navigation dans l'application
            - Encouragement au don de sang

            Règles importantes:
            - Réponds TOUJOURS en français
            - Sois concis et utile (max 3-4 paragraphes)
            - Pour les questions médicales spécifiques, recommande de consulter un médecin
            - Sois positif et encourageant concernant le don de sang
            - Utilise un ton professionnel mais chaleureux
            - Si tu ne sais pas, dis-le honnêtement

            Contexte: L'utilisateur utilise une application de gestion de banque de sang au Maroc.
            """;

    public AIService() {
        this.restTemplate = new RestTemplate();
    }

    public boolean isEnabled() {
        return aiEnabled && apiKey != null && !apiKey.isEmpty();
    }

    public String askAI(String question, String contexteUtilisateur) {
        if (!isEnabled()) {
            logger.debug("AI service is disabled or API key is missing");
            return getDefaultResponse();
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = buildRequestBody(question, contexteUtilisateur);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            return extractResponseContent(response.getBody());

        } catch (Exception e) {
            logger.error("Error calling AI API: {}", e.getMessage());
            return getDefaultResponse();
        }
    }

    private Map<String, Object> buildRequestBody(String question, String contexteUtilisateur) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("max_tokens", 500);
        body.put("temperature", 0.7);

        List<Map<String, String>> messages = new ArrayList<>();

        // System message
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", SYSTEM_PROMPT);
        messages.add(systemMessage);

        // Add user context if available
        if (contexteUtilisateur != null && !contexteUtilisateur.isEmpty()) {
            Map<String, String> contextMessage = new HashMap<>();
            contextMessage.put("role", "system");
            contextMessage.put("content", "Contexte utilisateur: " + contexteUtilisateur);
            messages.add(contextMessage);
        }

        // User question
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", question);
        messages.add(userMessage);

        body.put("messages", messages);

        return body;
    }

    @SuppressWarnings("unchecked")
    private String extractResponseContent(Map responseBody) {
        if (responseBody == null) {
            return getDefaultResponse();
        }

        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, String> message = (Map<String, String>) firstChoice.get("message");
                if (message != null) {
                    return message.get("content");
                }
            }
        } catch (Exception e) {
            logger.error("Error parsing AI response: {}", e.getMessage());
        }

        return getDefaultResponse();
    }

    private String getDefaultResponse() {
        return "Je ne suis pas en mesure de répondre à cette question pour le moment. " +
               "Veuillez reformuler votre question ou consulter la section FAQ de l'application. " +
               "Pour toute question urgente, contactez directement un centre de don de sang.";
    }

    public String generateContextFromUser(Long utilisateurId, String groupeSanguin, Integer nombreDons, Boolean eligible) {
        StringBuilder context = new StringBuilder();

        if (groupeSanguin != null) {
            context.append("Groupe sanguin de l'utilisateur: ").append(groupeSanguin).append(". ");
        }
        if (nombreDons != null) {
            context.append("Nombre de dons effectués: ").append(nombreDons).append(". ");
        }
        if (eligible != null) {
            context.append("Éligible au don: ").append(eligible ? "Oui" : "Non").append(". ");
        }

        return context.toString();
    }
}
